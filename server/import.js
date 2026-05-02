/**
 * HowToCook → SQLite 导入脚本
 *
 * 用法:
 *   node server/import.js                    # 导入全部菜谱
 *   node server/import.js --limit 10         # 只导入前 10 道
 *   node server/import.js --dir /path/to/dir # 指定 HowToCook dishes 目录
 */

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { initSchema, insertFullRecipe, getRecipeCount } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_DISHES_DIR = 'D:/Data/Study/Project/HowToCoo/dishes';

const INGREDIENT_HEADINGS = ['必备原料和工具', '原材料', '原料', '食材', '配料'];
const CALC_HEADINGS = ['计算'];
const STEP_HEADINGS = ['操作步骤', '操作', '步骤', '制作'];
const TIPS_HEADINGS = ['附加内容', '附加', '提示', '小贴士', '注意事项'];

const SEASONINGS = new Set([
  '盐', '糖', '酱油', '生抽', '老抽', '醋', '料酒', '蚝油',
  '花椒', '八角', '桂皮', '香叶', '辣椒', '胡椒', '五香粉', '十三香',
  '鸡精', '味精', '芝麻油', '香油', '淀粉', '生粉', '豆瓣酱', '甜面酱',
  '番茄酱', '咖喱粉', '孜然', '白芝麻', '黑芝麻', '葱', '姜', '蒜',
  '洋葱', '干辣椒', '泡椒', '豆豉', '腐乳', '黄油', '橄榄油',
]);

const TOOL_KEYWORDS = ['锅', '刀', '砧板', '碗', '盘', '勺', '铲', '盆', '烤箱', '微波炉'];
const NON_NUMERIC_QTY = { '适量': null, '少许': null, '一些': null, '若干': null, '按需': null };

const UNIT_NORMALIZE = {
  '克': 'g', '千克': 'kg', '公斤': 'kg',
  '毫升': 'ml', 'mL': 'ml', 'ML': 'ml',
  '汤匙': '勺', '大勺': '勺', '小勺': '勺', '茶匙': '勺',
  '棵': '颗',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function cleanUnit(raw) {
  if (!raw) return '';
  let unit = raw
    .replace(/[（(].*?[）)]/g, '')
    .replace(/[*×xX]\s*份数/g, '')
    .replace(/，.*$/g, '')
    .replace(/[。.、]$/g, '')
    .replace(/\s+/g, '')
    .trim();
  return UNIT_NORMALIZE[unit] || unit;
}

function extractText(token) {
  if (!token) return '';
  if (token.text) return token.text;
  if (token.tokens) return token.tokens.map(extractText).join('');
  if (token.items) return token.items.map(extractText).join('\n');
  return '';
}

function findSectionByHeadings(tokens, keywords) {
  const sectionTokens = [];
  let inSection = false;
  let sectionDepth = 0;
  for (const token of tokens) {
    if (token.type === 'heading') {
      // Skip H1 (title), only match H2+ for sections
      if (token.depth <= 1) continue;
      const headingText = extractText(token).trim();
      if (keywords.some(kw => headingText.includes(kw))) {
        inSection = true;
        sectionDepth = token.depth;
        continue;
      }
      if (inSection && token.depth <= sectionDepth) break;
    }
    if (inSection) sectionTokens.push(token);
  }
  return sectionTokens;
}

function extractListItems(tokens) {
  const items = [];
  for (const token of tokens) {
    if (token.type === 'list') {
      for (const item of token.items) {
        const text = extractText(item).trim();
        if (text) items.push(text);
      }
    }
  }
  return items;
}

function parseIngredient(text) {
  const cleaned = text.replace(/^[-*+]\s*/, '').trim();
  const match = cleaned.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    return { name: match[1].trim(), qty: parseFloat(match[2]), unit: cleanUnit(match[3]), raw: cleaned };
  }
  for (const [key, val] of Object.entries(NON_NUMERIC_QTY)) {
    if (cleaned.includes(key)) {
      return { name: cleaned.replace(key, '').trim(), qty: val, unit: key, raw: cleaned };
    }
  }
  return { name: cleaned, qty: null, unit: '', raw: cleaned };
}

function parseCalcLine(text) {
  const cleaned = text.replace(/^[-*+]\s*/, '').trim();
  const match = cleaned.match(/^(.+?)\s*(\d+(?:\.\d+)?)(?:\s*[～~\-]\s*\d+(?:\.\d+)?)?\s*(.*)$/);
  if (match) {
    return {
      name: match[1].replace(/（.*?）/g, '').trim(),
      qty: parseFloat(match[2]),
      unit: cleanUnit(match[3]),
      raw: cleaned,
    };
  }
  for (const [key, val] of Object.entries(NON_NUMERIC_QTY)) {
    if (cleaned.includes(key)) {
      return { name: cleaned.replace(key, '').replace(/（.*?）/g, '').trim(), qty: val, unit: key, raw: cleaned };
    }
  }
  return null;
}

function splitIngredientLine(line) {
  let text = line
    .replace(/`/g, '')
    .replace(/^(主料|辅料|炒料|其他配料?|调料|香料)[：:]\s*/, '')
    .replace(/[，,]\s*$/, '')
    .replace(/、\s*$/, '')
    .trim();

  // or/或者/或 → 取第一个选项（仅匹配括号外的 or）
  const noParens = text.replace(/[（(][^）)]*[）)]/g, '');
  if (/(?:or|或者)\s/.test(noParens)) {
    text = text.replace(/\s+(?:or|或者)\s.+$/, '').trim();
  } else if (/或者/.test(noParens)) {
    text = text.replace(/或者.+$/, '').trim();
  } else if (/或/.test(noParens)) {
    text = text.replace(/或.+$/, '').trim();
  }
  text = text.replace(/\s+and\/or\s.+$/, '');

  // 按顿号分割多个食材
  const parts = text.split('、').map(s => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [line.trim()];
}

function isSeasoning(name) { return SEASONINGS.has(name); }
function isTool(text) { return TOOL_KEYWORDS.some(kw => text.includes(kw)); }

function parseDifficulty(tokens) {
  for (const token of tokens) {
    const text = extractText(token);
    const stars = (text.match(/[★⭐]/g) || []).length;
    if (stars > 0) return Math.min(stars, 5);
  }
  return 0;
}

// ── Recipe Parser ────────────────────────────────────────────────────────────

function parseRecipe(filePath, markdown) {
  const tokens = marked.lexer(markdown);
  const title = filePath.replace(/\.md$/, '').split(/[/\\]/).pop();
  const dirName = filePath.replace(/\\/g, '/').split('/').slice(-2, -1)[0] || '';
  const category = dirName;

  let servings = 1;
  for (const token of tokens.slice(0, 10)) {
    const text = extractText(token);
    const m = text.match(/(\d+)\s*人份/);
    if (m) { servings = parseInt(m[1], 10); break; }
  }

  const ingredientSection = findSectionByHeadings(tokens, INGREDIENT_HEADINGS);
  if (ingredientSection.length === 0) throw new Error('No ingredient section found');

  const rawIngredientLines = extractListItems(ingredientSection);
  if (rawIngredientLines.length === 0) throw new Error('Ingredient section is empty');

  const calcSection = findSectionByHeadings(tokens, CALC_HEADINGS);
  const calcLines = extractListItems(calcSection);

  const quantityMap = {};
  for (const line of calcLines) {
    const parts = splitIngredientLine(line);
    for (const part of parts) {
      const parsed = parseCalcLine(part);
      if (parsed) quantityMap[parsed.name] = parsed;
    }
  }

  const parsed_ingredients = [];
  const tools = [];

  for (const line of rawIngredientLines) {
    const parts = splitIngredientLine(line);
    for (const part of parts) {
      if (isTool(part)) { tools.push(part); continue; }

      const parsed = parseIngredient(part);
      const nameClean = parsed.name.replace(/（.*?）/g, '').trim();
      const calcEntry = quantityMap[nameClean];

      if (calcEntry) {
        parsed_ingredients.push({
          name: nameClean, qty: calcEntry.qty, unit: calcEntry.unit,
          is_seasoning: isSeasoning(nameClean), raw: calcEntry.raw,
        });
      } else {
        parsed_ingredients.push({
          name: nameClean, qty: parsed.qty, unit: parsed.unit,
          is_seasoning: isSeasoning(nameClean), raw: parsed.raw,
        });
      }
    }
  }

  const stepSection = findSectionByHeadings(tokens, STEP_HEADINGS);
  if (stepSection.length === 0) throw new Error('No step section found');

  const steps = extractListItems(stepSection);
  if (steps.length === 0) throw new Error('Step section is empty');

  const tipsSection = findSectionByHeadings(tokens, TIPS_HEADINGS);
  const tips = extractListItems(tipsSection);

  return {
    id: title, title, category, servings,
    parsed_ingredients, steps, tips, tools,
    difficulty: parseDifficulty(tokens),
  };
}

// ── File Discovery ───────────────────────────────────────────────────────────

function listMarkdownFiles(dirPath) {
  const files = [];
  function walk(currentPath) {
    const entries = readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push({ relativePath: relative(dirPath, fullPath), fullPath });
      }
    }
  }
  walk(dirPath);
  return files;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let dishesDir = DEFAULT_DISHES_DIR;
let limit = Infinity;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit') limit = parseInt(args[++i], 10);
  else if (args[i] === '--dir') dishesDir = args[++i];
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`Reading recipes from: ${dishesDir}`);
initSchema();

const files = listMarkdownFiles(dishesDir);
console.log(`Found ${files.length} markdown files.`);
console.log(`Import limit: ${limit === Infinity ? 'all' : limit}`);

let imported = 0;
let failed = 0;

for (const file of files) {
  if (imported >= limit) break;

  try {
    const markdown = readFileSync(file.fullPath, 'utf-8');
    const recipe = parseRecipe(file.relativePath, markdown);
    insertFullRecipe(recipe);
    imported++;
    console.log(`[${imported}] OK: ${recipe.title} (${recipe.parsed_ingredients.length} ingredients, ${recipe.steps.length} steps, ${recipe.tips.length} tips)`);
  } catch (err) {
    failed++;
    console.error(`FAIL: ${file.relativePath} — ${err.message}`);
  }
}

console.log(`\nDone! Imported: ${imported}, Failed: ${failed}`);
console.log(`Total recipes in DB: ${getRecipeCount()}`);

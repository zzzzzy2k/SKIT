import { marked } from 'marked';
import { writeFileSync, readFileSync, readdirSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const INGREDIENT_HEADINGS = ['必备原料和工具', '原材料', '原料', '食材', '配料'];
const CALC_HEADINGS = ['计算'];
const STEP_HEADINGS = ['操作步骤', '步骤', '做法', '制作'];
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

function cleanUnit(raw) {
  if (!raw) return '';
  let unit = raw
    .replace(/[（(].*?[）)]/g, '')   // 去掉括号注释：（一小块）（可选）
    .replace(/[*×xX]\s*份数/g, '')   // 去掉 *份数
    .replace(/，.*$/g, '')            // 去掉逗号后内容：g，用于碗汁
    .replace(/[。.、]$/g, '')         // 去掉尾部标点
    .replace(/\s+/g, '')             // 去掉空格
    .trim();
  return UNIT_NORMALIZE[unit] || unit;
}

const errors = [];

// ── Helpers ──────────────────────────────────────────────────────────────────

function listMarkdownFilesLocal(dirPath) {
  const files = [];

  function walkDir(currentPath) {
    const entries = readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = relative(dirPath, fullPath);
        files.push({
          path: `dishes/${relativePath.replace(/\\/g, '/')}`,
          name: entry.name,
          fullPath: fullPath,
        });
      }
    }
  }

  walkDir(dirPath);
  return files;
}

// ── AST parsing ──────────────────────────────────────────────────────────────

function parseMarkdownToAST(markdown) {
  return marked.lexer(markdown);
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
      const headingText = extractText(token).trim();
      if (keywords.some(kw => headingText.includes(kw))) {
        inSection = true;
        sectionDepth = token.depth;
        continue;
      }
      if (inSection && token.depth <= sectionDepth) {
        break;
      }
    }
    if (inSection) {
      sectionTokens.push(token);
    }
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

// ── Ingredient parsing ───────────────────────────────────────────────────────

function parseIngredient(text) {
  const cleaned = text.replace(/^[-*+]\s*/, '').trim();
  const match = cleaned.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(.*)$/);

  if (match) {
    const name = match[1].trim();
    const qty = parseFloat(match[2]);
    const unit = cleanUnit(match[3]);
    return { name, qty, unit, raw: cleaned };
  }

  // Check for non-numeric quantities
  for (const [key, val] of Object.entries(NON_NUMERIC_QTY)) {
    if (cleaned.includes(key)) {
      const name = cleaned.replace(key, '').trim();
      return { name, qty: val, unit: key, raw: cleaned };
    }
  }

  return { name: cleaned, qty: null, unit: '', raw: cleaned };
}

function parseCalcLine(text) {
  const cleaned = text.replace(/^[-*+]\s*/, '').trim();

  // Match: "鸡翅 10 ～ 12 只" or "可乐 500ml" or "大蒜 2-3 瓣"
  const match = cleaned.match(/^(.+?)\s+(\d+(?:\.\d+)?)(?:\s*[～~\-]\s*\d+(?:\.\d+)?)?\s*(.*)$/);

  if (match) {
    const name = match[1].replace(/（.*?）/g, '').trim();
    const qty = parseFloat(match[2]);
    const unit = cleanUnit(match[3]);
    return { name, qty, unit, raw: cleaned };
  }

  // Check for non-numeric quantities
  for (const [key, val] of Object.entries(NON_NUMERIC_QTY)) {
    if (cleaned.includes(key)) {
      const name = cleaned.replace(key, '').replace(/（.*?）/g, '').trim();
      return { name, qty: val, unit: key, raw: cleaned };
    }
  }

  return null;
}

function isSeasoning(name) {
  return SEASONINGS.has(name);
}

function isTool(text) {
  return TOOL_KEYWORDS.some(kw => text.includes(kw));
}

// ── Difficulty parsing ───────────────────────────────────────────────────────

function parseDifficulty(tokens) {
  for (const token of tokens) {
    const text = extractText(token);
    const stars = (text.match(/[★⭐]/g) || []).length;
    if (stars > 0) return Math.min(stars, 5);
  }
  return 0;
}

// ── Main recipe parser ───────────────────────────────────────────────────────

function parseRecipe(file, markdown) {
  const tokens = parseMarkdownToAST(markdown);

  // Title from filename
  const title = file.name.replace('.md', '');

  // Category from directory path
  const pathParts = file.path.split('/');
  const category = pathParts.length > 2 ? pathParts[1] : '';

  // Servings — try to find in first few tokens
  let servings = 1;
  for (const token of tokens.slice(0, 10)) {
    const text = extractText(token);
    const servingsMatch = text.match(/(\d+)\s*人份/);
    if (servingsMatch) {
      servings = parseInt(servingsMatch[1], 10);
      break;
    }
  }

  // Ingredients section
  const ingredientSection = findSectionByHeadings(tokens, INGREDIENT_HEADINGS);
  if (ingredientSection.length === 0) {
    throw new Error(`No ingredient section found`);
  }

  const rawIngredientLines = extractListItems(ingredientSection);
  if (rawIngredientLines.length === 0) {
    throw new Error(`Ingredient section is empty`);
  }

  // Get quantities from 计算 section
  const calcSection = findSectionByHeadings(tokens, CALC_HEADINGS);
  const calcLines = extractListItems(calcSection);

  const quantityMap = {};
  for (const line of calcLines) {
    const parsed = parseCalcLine(line);
    if (parsed) {
      quantityMap[parsed.name] = parsed;
    }
  }

  const ingredients = [];
  const ingredients_with_quantity = [];
  const parsed_ingredients = [];
  const tools = [];

  for (const line of rawIngredientLines) {
    if (isTool(line)) {
      tools.push(line);
      continue;
    }

    const parsed = parseIngredient(line);
    const nameClean = parsed.name.replace(/（.*?）/g, '').trim();
    const calcEntry = quantityMap[nameClean];

    ingredients.push(nameClean);
    if (calcEntry) {
      ingredients_with_quantity.push(calcEntry.raw);
      parsed_ingredients.push({
        name: nameClean,
        qty: calcEntry.qty,
        unit: calcEntry.unit,
        is_seasoning: isSeasoning(nameClean),
        raw: calcEntry.raw,
      });
    } else {
      ingredients_with_quantity.push(parsed.raw);
      parsed_ingredients.push({
        name: nameClean,
        qty: parsed.qty,
        unit: parsed.unit,
        is_seasoning: isSeasoning(nameClean),
        raw: parsed.raw,
      });
    }
  }

  // Steps section
  const stepSection = findSectionByHeadings(tokens, STEP_HEADINGS);
  if (stepSection.length === 0) {
    throw new Error(`No step section found`);
  }

  const steps = extractListItems(stepSection);
  if (steps.length === 0) {
    throw new Error(`Step section is empty`);
  }

  // Tips section (附加内容)
  const tipsSection = findSectionByHeadings(tokens, TIPS_HEADINGS);
  const tips = extractListItems(tipsSection);

  // Difficulty
  const difficulty = parseDifficulty(tokens);

  return {
    id: title,
    title,
    category,
    servings,
    ingredients,
    ingredients_with_quantity,
    parsed_ingredients,
    steps,
    tips,
    tools,
    difficulty,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dishesDir = process.argv[2] || 'D:/Data/Study/Project/HowToCoo/dishes';
  console.log(`Reading recipes from: ${dishesDir}`);

  const files = listMarkdownFilesLocal(dishesDir);
  console.log(`Found ${files.length} markdown files.`);

  const recipes = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = `[${i + 1}/${files.length}]`;
    try {
      console.log(`${progress} Processing ${file.path}...`);
      const markdown = readFileSync(file.fullPath, 'utf-8');

      const recipe = parseRecipe(file, markdown);
      recipes.push(recipe);
      console.log(`${progress} OK: ${recipe.title} (${recipe.parsed_ingredients.length} ingredients, ${recipe.steps.length} steps)`);
    } catch (err) {
      const msg = `${progress} FAIL: ${file.path} — ${err.message}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // Write output
  const outPath = join(ROOT, 'public', 'recipes.json');
  writeFileSync(outPath, JSON.stringify(recipes, null, 2), 'utf-8');
  console.log(`\nWrote ${recipes.length} recipes to ${outPath}`);

  // Write errors
  if (errors.length > 0) {
    const errPath = join(ROOT, 'errors.log');
    writeFileSync(errPath, errors.join('\n') + '\n', 'utf-8');
    console.log(`${errors.length} errors logged to ${errPath}`);
  } else {
    console.log('No errors!');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

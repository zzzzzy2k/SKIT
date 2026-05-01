# SKit (食刻) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cooking decision assistant web app that helps users decide what to cook based on available ingredients, with recipe browsing, serving scaling, favorites, and shopping list generation.

**Architecture:** React 18 SPA with Vite bundler, Tailwind CSS for styling, React Router for navigation. Recipe data is pre-fetched from HowToCook GitHub repo via a Node.js script, parsed from Markdown to structured JSON using AST, and bundled as a static asset. All state (favorites, history) is stored in localStorage.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router v6, Vitest, React Testing Library, marked/unified (AST parsing), localStorage

---

## File Structure

```
skit/
├── public/
│   └── recipes.json                    # Generated recipe data
├── scripts/
│   └── fetch-recipes.js                # Data fetching + AST parsing script
├── src/
│   ├── components/
│   │   ├── Layout.jsx                  # App shell: nav + outlet + bottom tabs
│   │   ├── RecipeCard.jsx              # Card: title + difficulty + favorite toggle
│   │   ├── IngredientFilter.jsx        # Multi-select ingredient tags with clear
│   │   ├── ServingSelector.jsx         # +/- buttons + input for serving count
│   │   ├── ShoppingListModal.jsx       # Modal: scaled ingredients + copy button
│   │   ├── SkeletonCard.jsx            # Loading placeholder card
│   │   ├── EmptyState.jsx              # Empty state with message + optional CTA
│   │   └── ErrorBoundary.jsx           # Catch-all error display + retry
│   ├── hooks/
│   │   ├── useRecipes.js               # Load + cache recipes.json
│   │   ├── useFavorites.js             # localStorage CRUD for favorites
│   │   └── useLocalStorage.js          # Generic localStorage hook with fallback
│   ├── pages/
│   │   ├── Home.jsx                    # Filter + random + recipe list
│   │   ├── RecipeDetail.jsx            # Full recipe view + scaling + shopping
│   │   ├── Favorites.jsx               # Saved recipes list
│   │   └── NotFound.jsx                # 404 page
│   ├── utils/
│   │   ├── filterRecipes.js            # AND/OR hybrid filtering logic
│   │   ├── scaleIngredient.js          # Category-based serving scaling
│   │   ├── shoppingList.js             # Generate + format shopping list text
│   │   └── constants.js                # Seasonings dictionary + config
│   ├── __tests__/
│   │   ├── filterRecipes.test.js
│   │   ├── scaleIngredient.test.js
│   │   ├── shoppingList.test.js
│   │   ├── useFavorites.test.js
│   │   ├── Home.test.jsx
│   │   ├── RecipeDetail.test.jsx
│   │   └── Favorites.test.jsx
│   ├── App.jsx                         # Router setup
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Tailwind directives + global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vitest.config.js
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.js`
- Create: `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite project**

```bash
cd D:/Data/Study/Project/SKit
npm create vite@latest . -- --template react
```

Select: React, JavaScript (not TypeScript)

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vite**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
```

- [ ] **Step 4: Configure Tailwind CSS**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef7ee', 100: '#feecd3', 200: '#fbd5a5', 300: '#f8b76d', 400: '#f49132', 500: '#f1750f', 600: '#d85b09', 700: '#b4430c', 800: '#903610', 900: '#742e10' },
      },
    },
  },
  plugins: [],
}
```

```css
/* src/index.css */
@import "tailwindcss";

body {
  @apply bg-gray-50 text-gray-900 min-h-screen;
}
```

- [ ] **Step 5: Create test setup and entry files**

```js
// src/setupTests.js
import '@testing-library/jest-dom'
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>食刻 - 今天吃什么</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 6: Verify setup**

```bash
npm run dev
# Should start dev server at http://localhost:5173
# Browser should show blank page (no errors)

npm run test -- --run
# Should pass (no tests yet, but no errors)
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize React + Vite + Tailwind project"
```

---

## Task 2: Data Fetching & AST Parsing Script

**Files:**
- Create: `scripts/fetch-recipes.js`

This task generates `public/recipes.json` by fetching Markdown files from the HowToCook GitHub repo and parsing them with AST.

- [ ] **Step 1: Install parsing dependencies**

```bash
npm install -D marked unified remark-parse remark-gfm
```

- [ ] **Step 2: Write the fetch-recipes script**

```js
// scripts/fetch-recipes.js
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'

const GITHUB_API = 'https://api.github.com/repos/Anduin2017/HowToCook'
const DISHES_PATH = 'dishes'

const SEASONINGS = [
  '盐', '糖', '酱油', '生抽', '老抽', '醋', '料酒', '蚝油',
  '花椒', '八角', '桂皮', '香叶', '辣椒', '胡椒', '五香粉', '十三香',
  '鸡精', '味精', '芝麻油', '香油', '淀粉', '生粉', '豆瓣酱', '甜面酱',
  '番茄酱', '咖喱粉', '孜然', '白芝麻', '黑芝麻', '葱', '姜', '蒜',
  '洋葱', '干辣椒', '泡椒', '豆豉', '腐乳', '黄油', '橄榄油',
]

const SEASONING_SET = new Set(SEASONINGS)

const INGREDIENT_QTY_RE = /^(.+?)\s+(\d+(?:\.\d+)?)\s*(.*)$/
const DIFFICULTY_RE = /[★⭐]/g
const NON_NUMERIC_RE = /适量|少许|一些|若干|按需|根据个人口味/

// --- GitHub API helpers ---

async function fetchJSON(url) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'SKit-Recipe-Fetcher' },
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${url}`)
  return resp.json()
}

async function fetchText(url) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'SKit-Recipe-Fetcher' },
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${url}`)
  return resp.text()
}

async function listMarkdownFiles(dirPath) {
  const items = await fetchJSON(`${GITHUB_API}/contents/${dirPath}`)
  const files = []
  for (const item of items) {
    if (item.type === 'file' && item.name.endsWith('.md')) {
      files.push({ path: item.path, name: item.name, download_url: item.download_url })
    } else if (item.type === 'dir') {
      const subFiles = await listMarkdownFiles(item.path)
      files.push(...subFiles)
    }
  }
  return files
}

// --- AST Parsing ---

function parseMarkdownToAST(markdown) {
  return marked.lexer(markdown)
}

function findSectionByHeadings(tokens, keywords) {
  const sections = []
  let i = 0
  while (i < tokens.length) {
    if (tokens[i].type === 'heading' && tokens[i].depth <= 3) {
      const headingText = tokens[i].text || ''
      if (keywords.some(kw => headingText.includes(kw))) {
        // Collect tokens until next heading of same or higher depth
        const depth = tokens[i].depth
        i++
        const section = []
        while (i < tokens.length) {
          if (tokens[i].type === 'heading' && tokens[i].depth <= depth) break
          section.push(tokens[i])
          i++
        }
        sections.push({ heading: headingText, tokens: section })
        continue
      }
    }
    i++
  }
  return sections
}

function extractListItems(tokens) {
  const items = []
  for (const token of tokens) {
    if (token.type === 'list') {
      for (const item of token.items) {
        // Extract text from list item (handles nested tokens)
        const text = extractText(item).trim()
        if (text) items.push(text)
      }
    }
  }
  return items
}

function extractText(token) {
  if (typeof token === 'string') return token
  if (token.text) return token.text
  if (token.tokens) return token.tokens.map(t => extractText(t)).join('')
  if (token.items) return token.items.map(t => extractText(t)).join('\n')
  return ''
}

function parseIngredient(text) {
  const clean = text.replace(/^\d+[.、]\s*/, '').trim()
  if (NON_NUMERIC_RE.test(clean)) {
    return { raw: clean, name: clean.replace(NON_NUMERIC_RE, '').trim() || clean, qty: null, unit: null }
  }
  const match = clean.match(INGREDIENT_QTY_RE)
  if (match) {
    return { raw: clean, name: match[1].trim(), qty: parseFloat(match[2]), unit: match[3].trim() || null }
  }
  return { raw: clean, name: clean, qty: null, unit: null }
}

function isSeasoning(name) {
  return SEASONING_SET.has(name)
}

function parseDifficulty(tokens) {
  const fullText = tokens.map(t => extractText(t)).join('')
  const matches = fullText.match(DIFFICULTY_RE)
  return matches ? Math.min(matches.length, 5) : 1
}

function parseRecipe(file, markdown) {
  const tokens = parseMarkdownToAST(markdown)
  const title = (file.name || '').replace(/\.md$/, '')

  // Extract ingredients
  const ingredientSections = findSectionByHeadings(tokens, ['必备原料和工具', '原材料', '原料', '食材', '配料'])
  const rawIngredients = ingredientSections.flatMap(s => extractListItems(s.tokens))

  // Separate tools from ingredients
  const toolKeywords = ['锅', '刀', '砧板', '碗', '盘', '勺', '铲', '盆', '烤箱', '微波炉', '料理机', '搅拌']
  const ingredients = []
  const tools = []
  for (const item of rawIngredients) {
    if (toolKeywords.some(kw => item.includes(kw))) {
      tools.push(item)
    } else {
      ingredients.push(item)
    }
  }

  // Parse structured ingredients
  const parsed_ingredients = ingredients.map(parseIngredient).map(p => ({
    ...p,
    is_seasoning: isSeasoning(p.name),
  }))

  // Extract steps
  const stepSections = findSectionByHeadings(tokens, ['操作步骤', '步骤', '做法', '制作'])
  const steps = stepSections.flatMap(s => extractListItems(s.tokens))

  // Difficulty
  const difficulty = parseDifficulty(tokens)

  // Category from directory path
  const pathParts = file.path.split('/')
  const category = pathParts.length > 2 ? pathParts[1] : '未分类'

  return {
    id: title,
    title,
    category,
    servings: 1,
    ingredients: parsed_ingredients.map(p => p.name),
    ingredients_with_quantity: parsed_ingredients.map(p => p.raw),
    parsed_ingredients,
    steps,
    tools,
    difficulty,
    raw_markdown: markdown,
  }
}

// --- Main ---

async function main() {
  console.log('Fetching recipe file list from HowToCook...')
  const files = await listMarkdownFiles(DISHES_PATH)
  console.log(`Found ${files.length} markdown files`)

  const recipes = []
  const errors = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    console.log(`[${i + 1}/${files.length}] Parsing: ${file.name}`)
    try {
      const markdown = await fetchText(file.download_url)
      const recipe = parseRecipe(file, markdown)
      if (recipe.steps.length > 0 && recipe.ingredients.length > 0) {
        recipes.push(recipe)
      } else {
        errors.push({ file: file.path, reason: 'Missing steps or ingredients' })
      }
    } catch (err) {
      errors.push({ file: file.path, reason: err.message })
    }
    // Rate limit: 100ms between requests
    await new Promise(r => setTimeout(r, 100))
  }

  // Write output
  const outDir = path.resolve('public')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'recipes.json'), JSON.stringify(recipes, null, 2))

  // Write error log
  if (errors.length > 0) {
    fs.writeFileSync('errors.log', errors.map(e => `${e.file}: ${e.reason}`).join('\n'))
    console.log(`\n${errors.length} errors written to errors.log`)
  }

  console.log(`\nDone! ${recipes.length} recipes written to public/recipes.json`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
```

- [ ] **Step 3: Test the script locally**

```bash
node scripts/fetch-recipes.js
# Should fetch recipes and create public/recipes.json
# Check errors.log for any parsing failures
```

- [ ] **Step 4: Verify output structure**

```bash
node -e "const r = require('./public/recipes.json'); console.log('Total:', r.length); console.log('Sample:', JSON.stringify(r[0], null, 2).slice(0, 500))"
```

Expected: JSON with id, title, category, servings, ingredients, parsed_ingredients, steps, tools, difficulty fields.

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-recipes.js public/recipes.json
git commit -m "feat: add recipe fetching script with AST parsing"
```

---

## Task 3: Utility Functions (TDD)

**Files:**
- Create: `src/utils/constants.js`, `src/utils/filterRecipes.js`, `src/utils/scaleIngredient.js`, `src/utils/shoppingList.js`
- Create: `src/__tests__/filterRecipes.test.js`, `src/__tests__/scaleIngredient.test.js`, `src/__tests__/shoppingList.test.js`

### 3a: Constants

- [ ] **Step 1: Create constants file**

```js
// src/utils/constants.js
export const SEASONINGS = [
  '盐', '糖', '酱油', '生抽', '老抽', '醋', '料酒', '蚝油',
  '花椒', '八角', '桂皮', '香叶', '辣椒', '胡椒', '五香粉', '十三香',
  '鸡精', '味精', '芝麻油', '香油', '淀粉', '生粉', '豆瓣酱', '甜面酱',
  '番茄酱', '咖喱粉', '孜然', '白芝麻', '黑芝麻', '葱', '姜', '蒜',
]

export const SEASONING_SET = new Set(SEASONINGS)

export const MIN_SERVINGS = 1
export const MAX_SERVINGS = 10
export const DEFAULT_SERVINGS = 1
```

### 3b: filterRecipes — Hybrid AND/OR Logic

- [ ] **Step 2: Write failing tests for filterRecipes**

```js
// src/__tests__/filterRecipes.test.js
import { describe, it, expect } from 'vitest'
import { filterRecipes } from '../utils/filterRecipes'

const recipes = [
  { id: '1', title: '番茄炒蛋', ingredients: ['鸡蛋', '番茄', '盐'] },
  { id: '2', title: '蛋炒饭', ingredients: ['鸡蛋', '米饭', '盐', '葱'] },
  { id: '3', title: '红烧肉', ingredients: ['五花肉', '酱油', '糖', '姜'] },
  { id: '4', title: '凉拌黄瓜', ingredients: ['黄瓜', '醋', '蒜', '辣椒'] },
]

describe('filterRecipes', () => {
  it('returns all recipes when no ingredients selected', () => {
    const result = filterRecipes(recipes, [])
    expect(result.recipes).toHaveLength(4)
    expect(result.isFallback).toBe(false)
  })

  it('returns matching recipes with AND logic', () => {
    const result = filterRecipes(recipes, ['鸡蛋', '番茄'])
    expect(result.recipes).toHaveLength(1)
    expect(result.recipes[0].id).toBe('1')
    expect(result.isFallback).toBe(false)
  })

  it('falls back to OR logic when AND returns empty', () => {
    const result = filterRecipes(recipes, ['鸡蛋', '五花肉'])
    expect(result.isFallback).toBe(true)
    expect(result.recipes.length).toBeGreaterThan(0)
    // Should include recipes with either 鸡蛋 or 五花肉
    const ids = result.recipes.map(r => r.id)
    expect(ids).toContain('1') // has 鸡蛋
    expect(ids).toContain('2') // has 鸡蛋
    expect(ids).toContain('3') // has 五花肉
  })

  it('returns empty with fallback=false when OR also returns empty', () => {
    const result = filterRecipes(recipes, ['不存在的食材'])
    expect(result.recipes).toHaveLength(0)
    expect(result.isFallback).toBe(true)
  })

  it('handles single ingredient selection', () => {
    const result = filterRecipes(recipes, ['盐'])
    expect(result.isFallback).toBe(false)
    expect(result.recipes).toHaveLength(2) // 番茄炒蛋, 蛋炒饭
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/filterRecipes.test.js
```

Expected: FAIL — `filterRecipes` not found.

- [ ] **Step 4: Implement filterRecipes**

```js
// src/utils/filterRecipes.js
/**
 * Filter recipes by selected ingredients with hybrid AND/OR logic.
 * Returns { recipes, isFallback } where isFallback indicates OR fallback was used.
 */
export function filterRecipes(recipes, selectedIngredients) {
  if (!selectedIngredients || selectedIngredients.length === 0) {
    return { recipes, isFallback: false }
  }

  const selected = new Set(selectedIngredients)

  // AND logic: recipe must contain ALL selected ingredients
  const andResult = recipes.filter(recipe =>
    [...selected].every(ing => recipe.ingredients.includes(ing))
  )

  if (andResult.length > 0) {
    return { recipes: andResult, isFallback: false }
  }

  // OR fallback: recipe must contain at least ONE selected ingredient
  const orResult = recipes.filter(recipe =>
    [...selected].some(ing => recipe.ingredients.includes(ing))
  )

  return { recipes: orResult, isFallback: true }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/filterRecipes.test.js
```

Expected: All 5 tests PASS.

### 3c: scaleIngredient — Category-Based Scaling

- [ ] **Step 6: Write failing tests for scaleIngredient**

```js
// src/__tests__/scaleIngredient.test.js
import { describe, it, expect } from 'vitest'
import { scaleIngredient, scaleIngredients } from '../utils/scaleIngredient'

describe('scaleIngredient', () => {
  it('scales main ingredients linearly', () => {
    const result = scaleIngredient({ name: '鸡蛋', qty: 3, unit: '个', is_seasoning: false }, 4)
    expect(result.qty).toBe(12)
    expect(result.unit).toBe('个')
  })

  it('scales seasonings with power-law coefficient', () => {
    const result = scaleIngredient({ name: '盐', qty: 3, unit: '克', is_seasoning: true }, 4)
    // 3 * 4^0.7 ≈ 3 * 2.639 ≈ 7.917 → rounded to 8
    expect(result.qty).toBe(8)
  })

  it('returns null qty for non-numeric ingredients', () => {
    const result = scaleIngredient({ name: '盐', qty: null, unit: null, is_seasoning: true }, 4)
    expect(result.qty).toBeNull()
    expect(result.display).toBe('~适量')
  })

  it('handles serving count of 1 (no scaling)', () => {
    const result = scaleIngredient({ name: '番茄', qty: 2, unit: '个', is_seasoning: false }, 1)
    expect(result.qty).toBe(2)
  })

  it('rounds to reasonable precision', () => {
    const result = scaleIngredient({ name: '糖', qty: 1, unit: '克', is_seasoning: true }, 3)
    // 1 * 3^0.7 ≈ 2.16 → rounded to 2
    expect(result.qty).toBe(2)
  })
})

describe('scaleIngredients', () => {
  it('scales a list of ingredients', () => {
    const ingredients = [
      { name: '鸡蛋', qty: 3, unit: '个', is_seasoning: false },
      { name: '盐', qty: 3, unit: '克', is_seasoning: true },
    ]
    const result = scaleIngredients(ingredients, 2)
    expect(result[0].qty).toBe(6)
    expect(result[1].qty).toBe(4) // 3 * 2^0.7 ≈ 4.24 → 4
  })
})
```

- [ ] **Step 7: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/scaleIngredient.test.js
```

Expected: FAIL — `scaleIngredient` not found.

- [ ] **Step 8: Implement scaleIngredient**

```js
// src/utils/scaleIngredient.js
import { MIN_SERVINGS, MAX_SERVINGS } from './constants'

/**
 * Scale a single ingredient based on serving count.
 * Main ingredients: linear scaling.
 * Seasonings: power-law scaling (qty * servings^0.7).
 * Non-numeric: mark with ~ prefix.
 */
export function scaleIngredient(ingredient, servings) {
  const clamped = Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, Math.round(servings)))

  if (ingredient.qty === null || ingredient.qty === undefined) {
    return { ...ingredient, qty: null, display: `~${ingredient.raw || ingredient.name}` }
  }

  let scaledQty
  if (ingredient.is_seasoning) {
    scaledQty = ingredient.qty * Math.pow(clamped, 0.7)
  } else {
    scaledQty = ingredient.qty * clamped
  }

  // Round to integer if close, otherwise 1 decimal
  const rounded = Math.abs(scaledQty - Math.round(scaledQty)) < 0.1
    ? Math.round(scaledQty)
    : Math.round(scaledQty * 10) / 10

  return { ...ingredient, qty: rounded, display: `${rounded}${ingredient.unit || ''}` }
}

/**
 * Scale a list of ingredients.
 */
export function scaleIngredients(ingredients, servings) {
  return ingredients.map(ing => scaleIngredient(ing, servings))
}
```

- [ ] **Step 9: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/scaleIngredient.test.js
```

Expected: All 6 tests PASS.

### 3d: shoppingList — Generate & Format

- [ ] **Step 10: Write failing tests for shoppingList**

```js
// src/__tests__/shoppingList.test.js
import { describe, it, expect } from 'vitest'
import { generateShoppingList, formatShoppingList } from '../utils/shoppingList'

describe('generateShoppingList', () => {
  it('generates list from scaled ingredients', () => {
    const ingredients = [
      { name: '鸡蛋', qty: 6, unit: '个' },
      { name: '番茄', qty: 4, unit: '个' },
      { name: '盐', qty: 5, unit: '克', display: '~适量' },
    ]
    const result = generateShoppingList(ingredients)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ name: '鸡蛋', text: '鸡蛋 6个' })
  })

  it('uses display field when qty is null', () => {
    const ingredients = [
      { name: '盐', qty: null, unit: null, display: '~适量' },
    ]
    const result = generateShoppingList(ingredients)
    expect(result[0].text).toBe('盐 ~适量')
  })
})

describe('formatShoppingList', () => {
  it('formats list as plain text', () => {
    const items = [
      { name: '鸡蛋', text: '鸡蛋 6个' },
      { name: '番茄', text: '番茄 4个' },
    ]
    const result = formatShoppingList(items, '番茄炒蛋')
    expect(result).toContain('番茄炒蛋')
    expect(result).toContain('鸡蛋 6个')
    expect(result).toContain('番茄 4个')
  })
})
```

- [ ] **Step 11: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/shoppingList.test.js
```

Expected: FAIL.

- [ ] **Step 12: Implement shoppingList**

```js
// src/utils/shoppingList.js
/**
 * Generate shopping list items from scaled ingredients.
 */
export function generateShoppingList(scaledIngredients) {
  return scaledIngredients.map(ing => ({
    name: ing.name,
    text: ing.display || `${ing.qty}${ing.unit || ''}`,
  }))
}

/**
 * Format shopping list as plain text for clipboard.
 */
export function formatShoppingList(items, recipeTitle) {
  const lines = [
    `🛒 购物清单 - ${recipeTitle}`,
    '─'.repeat(20),
    ...items.map(item => `• ${item.text}`),
    '',
    '— 由「食刻」生成',
  ]
  return lines.join('\n')
}
```

- [ ] **Step 13: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/shoppingList.test.js
```

Expected: All 3 tests PASS.

- [ ] **Step 14: Commit utility functions**

```bash
git add src/utils/ src/__tests__/filterRecipes.test.js src/__tests__/scaleIngredient.test.js src/__tests__/shoppingList.test.js
git commit -m "feat: add utility functions with tests (filter, scale, shopping list)"
```

---

## Task 4: Custom Hooks (TDD)

**Files:**
- Create: `src/hooks/useLocalStorage.js`, `src/hooks/useRecipes.js`, `src/hooks/useFavorites.js`
- Create: `src/__tests__/useFavorites.test.js`

### 4a: useLocalStorage — Generic Hook with Fallback

- [ ] **Step 1: Create useLocalStorage hook**

```js
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

/**
 * Generic localStorage hook with fallback to in-memory state.
 * Falls back gracefully when localStorage is unavailable (privacy mode).
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      // localStorage unavailable — use initial value
      return initialValue
    }
  })

  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
      setIsAvailable(true)
    } catch {
      setIsAvailable(false)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue, isAvailable]
}
```

### 4b: useRecipes — Load & Cache Recipe Data

- [ ] **Step 2: Create useRecipes hook**

```js
// src/hooks/useRecipes.js
import { useState, useEffect } from 'react'

let cache = null

/**
 * Load recipes.json and cache in memory.
 * Returns { recipes, loading, error }.
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return

    setLoading(true)
    fetch('/recipes.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load recipes: ${res.status}`)
        return res.json()
      })
      .then(data => {
        cache = data
        setRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { recipes, loading, error, retry: () => { cache = null; setError(null); setLoading(true) } }
}
```

### 4c: useFavorites — Favorites CRUD

- [ ] **Step 3: Write failing tests for useFavorites**

```js
// src/__tests__/useFavorites.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../hooks/useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a recipe to favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.favorites).toContain('番茄炒蛋')
  })

  it('removes a recipe from favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.favorites).not.toContain('番茄炒蛋')
  })

  it('checks if a recipe is favorited', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('番茄炒蛋')).toBe(false)
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.isFavorite('番茄炒蛋')).toBe(true)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    const stored = JSON.parse(localStorage.getItem('skit_favorites'))
    expect(stored).toContain('番茄炒蛋')
  })
})
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/useFavorites.test.js
```

Expected: FAIL.

- [ ] **Step 5: Implement useFavorites**

```js
// src/hooks/useFavorites.js
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'skit_favorites'

/**
 * Manage recipe favorites via localStorage.
 * Returns { favorites, toggleFavorite, isFavorite, isAvailable }.
 */
export function useFavorites() {
  const [favorites, setFavorites, isAvailable] = useLocalStorage(STORAGE_KEY, [])

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId)
      }
      return [...prev, recipeId]
    })
  }

  const isFavorite = (recipeId) => favorites.includes(recipeId)

  return { favorites, toggleFavorite, isFavorite, isAvailable }
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/useFavorites.test.js
```

Expected: All 5 tests PASS.

- [ ] **Step 7: Commit hooks**

```bash
git add src/hooks/ src/__tests__/useFavorites.test.js
git commit -m "feat: add custom hooks (useLocalStorage, useRecipes, useFavorites)"
```

---

## Task 5: Common Components

**Files:**
- Create: `src/components/Layout.jsx`, `src/components/RecipeCard.jsx`, `src/components/IngredientFilter.jsx`, `src/components/ServingSelector.jsx`, `src/components/SkeletonCard.jsx`, `src/components/EmptyState.jsx`, `src/components/ErrorBoundary.jsx`, `src/components/ShoppingListModal.jsx`

### 5a: Layout — App Shell

- [ ] **Step 1: Create Layout component**

```jsx
// src/components/Layout.jsx
import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <NavLink to="/" className="text-xl font-bold text-primary-600">
            🍳 食刻
          </NavLink>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-sm ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}`
            }
          >
            🏠 首页
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-sm ${isActive ? 'text-primary-600 font-medium' : 'text-gray-500'}`
            }
          >
            ❤️ 收藏
          </NavLink>
        </div>
      </nav>

      {/* Attribution */}
      <footer className="text-center text-xs text-gray-400 py-2">
        菜谱数据来自 HowToCook 开源项目 (MIT)
      </footer>
    </div>
  )
}
```

### 5b: RecipeCard — Recipe Preview Card

- [ ] **Step 2: Create RecipeCard component**

```jsx
// src/components/RecipeCard.jsx
import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const stars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty)

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <Link to={`/recipe/${encodeURIComponent(recipe.id)}`} className="block">
        <h3 className="font-medium text-gray-900 mb-1">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{stars}</p>
        <p className="text-sm text-gray-400">
          {recipe.ingredients.slice(0, 4).join('、')}
          {recipe.ingredients.length > 4 && '...'}
        </p>
      </Link>
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(recipe.id) }}
          className="absolute top-3 right-3 text-lg"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}
```

### 5c: IngredientFilter — Multi-Select Tags

- [ ] **Step 3: Create IngredientFilter component**

```jsx
// src/components/IngredientFilter.jsx
import { useState, useMemo } from 'react'

export default function IngredientFilter({ recipes, selected, onChange }) {
  const [search, setSearch] = useState('')

  // Extract unique ingredients from all recipes
  const allIngredients = useMemo(() => {
    const set = new Set()
    recipes.forEach(r => r.ingredients.forEach(i => set.add(i)))
    return [...set].sort()
  }, [recipes])

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return allIngredients
    return allIngredients.filter(i => i.includes(search))
  }, [allIngredients, search])

  const toggle = (ingredient) => {
    if (selected.includes(ingredient)) {
      onChange(selected.filter(i => i !== ingredient))
    } else {
      onChange([...selected, ingredient])
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium text-gray-700">按食材筛选</h2>
        {selected.length > 0 && (
          <button onClick={() => onChange([])} className="text-sm text-primary-600">
            清除全部
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="搜索食材..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {filtered.map(ingredient => (
          <button
            key={ingredient}
            onClick={() => toggle(ingredient)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selected.includes(ingredient)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {ingredient}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### 5d: ServingSelector — +/- Input

- [ ] **Step 4: Create ServingSelector component**

```jsx
// src/components/ServingSelector.jsx
import { MIN_SERVINGS, MAX_SERVINGS } from '../utils/constants'

export default function ServingSelector({ value, onChange }) {
  const handleChange = (newVal) => {
    const clamped = Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, newVal))
    onChange(clamped)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">人数</span>
      <button
        onClick={() => handleChange(value - 1)}
        disabled={value <= MIN_SERVINGS}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-30"
      >
        −
      </button>
      <input
        type="number"
        min={MIN_SERVINGS}
        max={MAX_SERVINGS}
        value={value}
        onChange={e => handleChange(parseInt(e.target.value) || MIN_SERVINGS)}
        className="w-12 text-center border rounded py-1"
      />
      <button
        onClick={() => handleChange(value + 1)}
        disabled={value >= MAX_SERVINGS}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-30"
      >
        +
      </button>
      <span className="text-sm text-gray-500">人份</span>
    </div>
  )
}
```

### 5e: ShoppingListModal — Copy Modal

- [ ] **Step 5: Create ShoppingListModal component**

```jsx
// src/components/ShoppingListModal.jsx
import { useState } from 'react'
import { generateShoppingList, formatShoppingList } from '../utils/shoppingList'

export default function ShoppingListModal({ scaledIngredients, recipeTitle, onClose }) {
  const [copied, setCopied] = useState(false)
  const items = generateShoppingList(scaledIngredients)
  const text = formatShoppingList(items, recipeTitle)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">🛒 购物清单</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
          <p className="font-medium mb-2">{recipeTitle}</p>
          {items.map((item, i) => (
            <p key={i} className="text-sm text-gray-700">• {item.text}</p>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-primary-500 text-white py-2 rounded-lg"
          >
            {copied ? '已复制 ✓' : '复制到剪贴板'}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-gray-500">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 5f: SkeletonCard, EmptyState, ErrorBoundary

- [ ] **Step 6: Create remaining common components**

```jsx
// src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
  )
}
```

```jsx
// src/components/EmptyState.jsx
import { Link } from 'react-router-dom'

export default function EmptyState({ message, actionText, actionTo }) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-4">🍽️</p>
      <p className="text-gray-500 mb-4">{message}</p>
      {actionText && actionTo && (
        <Link to={actionTo} className="text-primary-600 font-medium">
          {actionText}
        </Link>
      )}
    </div>
  )
}
```

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">😵</p>
          <p className="text-gray-600 mb-4">页面出了点问题</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 font-medium"
          >
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 7: Verify all components render without errors**

```bash
npm run dev
# Navigate to http://localhost:5173 — should see Layout with empty pages
```

- [ ] **Step 8: Commit components**

```bash
git add src/components/
git commit -m "feat: add common components (Layout, RecipeCard, Filter, Selector, Modal)"
```

---

## Task 6: Home Page

**Files:**
- Create: `src/pages/Home.jsx`
- Create: `src/__tests__/Home.test.jsx`

- [ ] **Step 1: Write failing test for Home page**

```jsx
// src/__tests__/Home.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

// Mock useRecipes
vi.mock('../hooks/useRecipes', () => ({
  useRecipes: () => ({
    recipes: [
      { id: '番茄炒蛋', title: '番茄炒蛋', ingredients: ['鸡蛋', '番茄', '盐'], difficulty: 1, parsed_ingredients: [] },
      { id: '蛋炒饭', title: '蛋炒饭', ingredients: ['鸡蛋', '米饭', '盐'], difficulty: 2, parsed_ingredients: [] },
    ],
    loading: false,
    error: null,
  }),
}))

vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
  }),
}))

const renderHome = () => render(<BrowserRouter><Home /></BrowserRouter>)

describe('Home page', () => {
  it('renders recipe list', () => {
    renderHome()
    expect(screen.getByText('番茄炒蛋')).toBeInTheDocument()
    expect(screen.getByText('蛋炒饭')).toBeInTheDocument()
  })

  it('shows random recommendation button', () => {
    renderHome()
    expect(screen.getByText(/随机推荐/)).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    vi.mock('../hooks/useRecipes', () => ({
      useRecipes: () => ({ recipes: [], loading: true, error: null }),
    }))
    renderHome()
    expect(screen.getByText('今天吃什么？')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/Home.test.jsx
```

Expected: FAIL.

- [ ] **Step 3: Implement Home page**

```jsx
// src/pages/Home.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { filterRecipes } from '../utils/filterRecipes'
import IngredientFilter from '../components/IngredientFilter'
import RecipeCard from '../components/RecipeCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const { recipes, loading, error } = useRecipes()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const navigate = useNavigate()

  const [selectedIngredients, setSelectedIngredients] = useState([])

  const { recipes: filtered, isFallback } = useMemo(
    () => filterRecipes(recipes, selectedIngredients),
    [recipes, selectedIngredients]
  )

  const handleRandom = () => {
    if (filtered.length === 0) return
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    navigate(`/recipe/${encodeURIComponent(pick.id)}`)
  }

  if (error) {
    return (
      <EmptyState
        message={`加载失败: ${error}`}
        actionText="重试"
        actionTo="/"
      />
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">今天吃什么？</h1>
        <p className="text-gray-500 mb-4">让「食刻」帮你决定</p>
        <button
          onClick={handleRandom}
          disabled={loading || filtered.length === 0}
          className="bg-primary-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
        >
          🎲 随机推荐
        </button>
      </div>

      {/* Ingredient filter */}
      {!loading && recipes.length > 0 && (
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <IngredientFilter
            recipes={recipes}
            selected={selectedIngredients}
            onChange={setSelectedIngredients}
          />
        </div>
      )}

      {/* Fallback notice */}
      {isFallback && filtered.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
          未找到同时包含这些食材的菜谱，以下菜谱至少包含其中一种食材。
          <button onClick={() => setSelectedIngredients([])} className="ml-2 underline">
            清除筛选
          </button>
        </div>
      )}

      {/* Recipe list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={selectedIngredients.length > 0 ? '没有找到匹配的菜谱，试试减少食材筛选条件' : '暂无菜谱数据'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <div key={recipe.id} className="relative">
              <RecipeCard
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/Home.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/__tests__/Home.test.jsx
git commit -m "feat: add Home page with ingredient filter and random recommendation"
```

---

## Task 7: Recipe Detail Page

**Files:**
- Create: `src/pages/RecipeDetail.jsx`
- Create: `src/__tests__/RecipeDetail.test.jsx`

- [ ] **Step 1: Write failing test for RecipeDetail**

```jsx
// src/__tests__/RecipeDetail.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import RecipeDetail from '../pages/RecipeDetail'

const mockRecipe = {
  id: '番茄炒蛋',
  title: '番茄炒蛋',
  category: '荤菜',
  difficulty: 1,
  servings: 1,
  ingredients: ['鸡蛋', '番茄', '盐'],
  ingredients_with_quantity: ['鸡蛋 3个', '番茄 2个', '盐 3克'],
  parsed_ingredients: [
    { name: '鸡蛋', qty: 3, unit: '个', is_seasoning: false, raw: '鸡蛋 3个' },
    { name: '番茄', qty: 2, unit: '个', is_seasoning: false, raw: '番茄 2个' },
    { name: '盐', qty: 3, unit: '克', is_seasoning: true, raw: '盐 3克' },
  ],
  steps: ['番茄切块', '鸡蛋打散', '先炒蛋再炒番茄'],
  tools: ['炒锅', '碗'],
}

vi.mock('../hooks/useRecipes', () => ({
  useRecipes: () => ({
    recipes: [mockRecipe],
    loading: false,
    error: null,
  }),
}))

vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: () => ({ id: '番茄炒蛋' }) }
})

describe('RecipeDetail page', () => {
  it('renders recipe title and steps', () => {
    render(<MemoryRouter><RecipeDetail /></MemoryRouter>)
    expect(screen.getByText('番茄炒蛋')).toBeInTheDocument()
    expect(screen.getByText('番茄切块')).toBeInTheDocument()
  })

  it('shows serving selector with default value 1', () => {
    render(<MemoryRouter><RecipeDetail /></MemoryRouter>)
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('scales ingredients when serving changes', () => {
    render(<MemoryRouter><RecipeDetail /></MemoryRouter>)
    const plusBtn = screen.getByText('+')
    fireEvent.click(plusBtn) // 1 → 2
    // 鸡蛋 3*2=6, 番茄 2*2=4, 盐 3*2^0.7≈5
    expect(screen.getByText('6个')).toBeInTheDocument()
  })

  it('shows shopping list modal when button clicked', () => {
    render(<MemoryRouter><RecipeDetail /></MemoryRouter>)
    fireEvent.click(screen.getByText(/购物清单/))
    expect(screen.getByText(/购物清单/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/RecipeDetail.test.jsx
```

Expected: FAIL.

- [ ] **Step 3: Implement RecipeDetail page**

```jsx
// src/pages/RecipeDetail.jsx
import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { scaleIngredients } from '../utils/scaleIngredient'
import { DEFAULT_SERVINGS } from '../utils/constants'
import ServingSelector from '../components/ServingSelector'
import ShoppingListModal from '../components/ShoppingListModal'
import EmptyState from '../components/EmptyState'

export default function RecipeDetail() {
  const { id } = useParams()
  const { recipes, loading } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [servings, setServings] = useState(DEFAULT_SERVINGS)
  const [showShoppingList, setShowShoppingList] = useState(false)

  const recipe = recipes.find(r => r.id === decodeURIComponent(id))

  const scaledIngredients = useMemo(
    () => recipe ? scaleIngredients(recipe.parsed_ingredients, servings) : [],
    [recipe, servings]
  )

  if (loading) {
    return <div className="text-center py-16"><div className="animate-spin text-4xl">🍳</div></div>
  }

  if (!recipe) {
    return <EmptyState message="菜谱未找到" actionText="返回首页" actionTo="/" />
  }

  const stars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty)

  return (
    <div>
      {/* Back + Favorite */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-primary-600 text-sm">← 返回首页</Link>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className="text-2xl"
          aria-label={isFavorite(recipe.id) ? '取消收藏' : '收藏'}
        >
          {isFavorite(recipe.id) ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
      <p className="text-gray-500 mb-1">{stars}</p>
      <p className="text-sm text-gray-400 mb-6">分类: {recipe.category}</p>

      {/* Serving selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <ServingSelector value={servings} onChange={setServings} />
      </div>

      {/* Ingredients */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <h2 className="font-bold text-gray-800 mb-3">食材清单</h2>
        <ul className="space-y-2">
          {scaledIngredients.map((ing, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{ing.name}</span>
              <span className="text-gray-500">
                {ing.qty !== null ? `${ing.qty}${ing.unit || ''}` : `~${ing.raw || '适量'}`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      {recipe.tools.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-3">工具</h2>
          <p className="text-sm text-gray-600">{recipe.tools.join('、')}</p>
        </div>
      )}

      {/* Steps */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <h2 className="font-bold text-gray-800 mb-3">操作步骤</h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setShowShoppingList(true)}
          className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-medium"
        >
          🛒 生成购物清单
        </button>
      </div>

      {/* Shopping list modal */}
      {showShoppingList && (
        <ShoppingListModal
          scaledIngredients={scaledIngredients}
          recipeTitle={recipe.title}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/RecipeDetail.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/RecipeDetail.jsx src/__tests__/RecipeDetail.test.jsx
git commit -m "feat: add RecipeDetail page with serving scaling and shopping list"
```

---

## Task 8: Favorites Page

**Files:**
- Create: `src/pages/Favorites.jsx`
- Create: `src/__tests__/Favorites.test.jsx`

- [ ] **Step 1: Write failing test for Favorites page**

```jsx
// src/__tests__/Favorites.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Favorites from '../pages/Favorites'

const mockRecipes = [
  { id: '番茄炒蛋', title: '番茄炒蛋', ingredients: ['鸡蛋', '番茄'], difficulty: 1, parsed_ingredients: [] },
  { id: '蛋炒饭', title: '蛋炒饭', ingredients: ['鸡蛋', '米饭'], difficulty: 2, parsed_ingredients: [] },
]

vi.mock('../hooks/useRecipes', () => ({
  useRecipes: () => ({ recipes: mockRecipes, loading: false, error: null }),
}))

vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: ['番茄炒蛋'],
    toggleFavorite: vi.fn(),
    isFavorite: (id) => id === '番茄炒蛋',
  }),
}))

describe('Favorites page', () => {
  it('shows favorited recipes', () => {
    render(<BrowserRouter><Favorites /></BrowserRouter>)
    expect(screen.getByText('番茄炒蛋')).toBeInTheDocument()
  })

  it('does not show non-favorited recipes', () => {
    render(<BrowserRouter><Favorites /></BrowserRouter>)
    expect(screen.queryByText('蛋炒饭')).not.toBeInTheDocument()
  })

  it('shows empty state when no favorites', () => {
    vi.mock('../hooks/useFavorites', () => ({
      useFavorites: () => ({
        favorites: [],
        toggleFavorite: vi.fn(),
        isFavorite: () => false,
      }),
    }))
    render(<BrowserRouter><Favorites /></BrowserRouter>)
    expect(screen.getByText(/暂无收藏/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/__tests__/Favorites.test.jsx
```

Expected: FAIL.

- [ ] **Step 3: Implement Favorites page**

```jsx
// src/pages/Favorites.jsx
import { useMemo } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'
import SkeletonCard from '../components/SkeletonCard'

export default function Favorites() {
  const { recipes, loading } = useRecipes()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const favoriteRecipes = useMemo(
    () => recipes.filter(r => favorites.includes(r.id)),
    [recipes, favorites]
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (favoriteRecipes.length === 0) {
    return <EmptyState message="暂无收藏，去首页探索吧" actionText="去首页" actionTo="/" />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">我的收藏</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteRecipes.map(recipe => (
          <div key={recipe.id} className="relative">
            <RecipeCard
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/__tests__/Favorites.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Favorites.jsx src/__tests__/Favorites.test.jsx
git commit -m "feat: add Favorites page with empty state"
```

---

## Task 9: 404 Page & Error Boundary Integration

**Files:**
- Create: `src/pages/NotFound.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create NotFound page**

```jsx
// src/pages/NotFound.jsx
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return <EmptyState message="页面不存在" actionText="返回首页" actionTo="/" />
}
```

- [ ] **Step 2: Wrap App with ErrorBoundary**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
# Navigate to http://localhost:5173/nonexistent — should show 404 page
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/NotFound.jsx src/App.jsx
git commit -m "feat: add 404 page and error boundary integration"
```

---

## Task 10: Final Verification & Cleanup

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```

Expected: Build succeeds, `dist/` directory created.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
# Verify all pages work in production mode
```

- [ ] **Step 4: Manual testing checklist**

Test each feature:
- [ ] 首页加载，显示菜谱列表
- [ ] 食材筛选：AND 逻辑正常工作
- [ ] 食材筛选：空结果时降级为 OR 逻辑，显示提示条
- [ ] 随机推荐：点击后跳转到随机菜谱详情页
- [ ] 菜谱详情：显示食材、步骤、工具
- [ ] 人数调整：主料线性缩放，调味料系数缩放
- [ ] 购物清单：生成并可复制
- [ ] 收藏：添加/取消收藏，刷新后保留
- [ ] 收藏夹页：显示已收藏菜谱，空状态提示
- [ ] 404 页面：访问不存在的路径显示友好提示
- [ ] 响应式：手机宽度下布局正常

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Summary

| Task | Description | Est. Time |
|:--|:--|:--|
| 1 | Project initialization (Vite + React + Tailwind) | 0.5h |
| 2 | Data fetching & AST parsing script | 2h |
| 3 | Utility functions (filter, scale, shopping list) | 1.5h |
| 4 | Custom hooks (useLocalStorage, useRecipes, useFavorites) | 1h |
| 5 | Common components (Layout, RecipeCard, Filter, etc.) | 2h |
| 6 | Home page | 1.5h |
| 7 | Recipe Detail page | 2h |
| 8 | Favorites page | 0.5h |
| 9 | 404 page & Error boundary | 0.5h |
| 10 | Final verification & cleanup | 1h |
| **Total** | | **~12.5h** |

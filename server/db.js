import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '..', 'data', 'recipes.db');

mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

let initialized = false;

// ── Schema ───────────────────────────────────────────────────────────────────

export function initSchema() {
  if (initialized) return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      difficulty INTEGER DEFAULT 0,
      servings INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      name TEXT NOT NULL,
      qty REAL,
      unit TEXT,
      is_seasoning INTEGER DEFAULT 0,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      step_order INTEGER NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_ingredients_recipe ON ingredients(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_steps_recipe ON steps(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_tips_recipe ON tips(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_tools_recipe ON tools(recipe_id);
  `);
  initialized = true;
}

// ── Insert ───────────────────────────────────────────────────────────────────

export function insertFullRecipe(recipe) {
  initSchema();
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(recipe.id);
    db.prepare('DELETE FROM steps WHERE recipe_id = ?').run(recipe.id);
    db.prepare('DELETE FROM tips WHERE recipe_id = ?').run(recipe.id);
    db.prepare('DELETE FROM tools WHERE recipe_id = ?').run(recipe.id);
    db.prepare('DELETE FROM recipes WHERE id = ?').run(recipe.id);

    db.prepare(`INSERT INTO recipes (id, title, category, difficulty, servings) VALUES (?, ?, ?, ?, ?)`)
      .run(recipe.id, recipe.title, recipe.category, recipe.difficulty, recipe.servings);

    const insIng = db.prepare('INSERT INTO ingredients (recipe_id, name, qty, unit, is_seasoning) VALUES (?, ?, ?, ?, ?)');
    for (const ing of recipe.parsed_ingredients) {
      insIng.run(recipe.id, ing.name, ing.qty, ing.unit || '', ing.is_seasoning ? 1 : 0);
    }

    const insStep = db.prepare('INSERT INTO steps (recipe_id, step_order, content) VALUES (?, ?, ?)');
    for (let i = 0; i < recipe.steps.length; i++) {
      insStep.run(recipe.id, i + 1, recipe.steps[i]);
    }

    if (recipe.tips) {
      const insTip = db.prepare('INSERT INTO tips (recipe_id, content) VALUES (?, ?)');
      for (const tip of recipe.tips) {
        insTip.run(recipe.id, tip);
      }
    }

    if (recipe.tools) {
      const insTool = db.prepare('INSERT INTO tools (recipe_id, name) VALUES (?, ?)');
      for (const tool of recipe.tools) {
        insTool.run(recipe.id, tool);
      }
    }
  });
  tx();
}

// ── Query ────────────────────────────────────────────────────────────────────

export function getAllRecipes() {
  initSchema();
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY title').all();
  const stmtIng = db.prepare('SELECT name FROM ingredients WHERE recipe_id = ?');
  return recipes.map(r => ({
    ...r,
    ingredients: stmtIng.all(r.id).map(i => i.name),
  }));
}

export function getRecipeById(id) {
  initSchema();
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!recipe) return null;

  const parsed_ingredients = db.prepare(
    'SELECT name, qty, unit, is_seasoning FROM ingredients WHERE recipe_id = ?'
  ).all(id).map(ing => ({ ...ing, is_seasoning: !!ing.is_seasoning }));

  const steps = db.prepare(
    'SELECT content FROM steps WHERE recipe_id = ? ORDER BY step_order'
  ).all(id).map(r => r.content);

  const tips = db.prepare(
    'SELECT content FROM tips WHERE recipe_id = ?'
  ).all(id).map(r => r.content);

  const tools = db.prepare(
    'SELECT name FROM tools WHERE recipe_id = ?'
  ).all(id).map(r => r.name);

  return { ...recipe, ingredients: parsed_ingredients.map(i => i.name), parsed_ingredients, steps, tips, tools };
}

export function getAllIngredientNames() {
  initSchema();
  return db.prepare('SELECT DISTINCT name FROM ingredients ORDER BY name').all().map(r => r.name);
}

export function getRecipeCount() {
  initSchema();
  return db.prepare('SELECT COUNT(*) as count FROM recipes').get().count;
}

export default db;

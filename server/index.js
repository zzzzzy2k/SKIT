import express from 'express';
import cors from 'cors';
import { initSchema, getAllRecipes, getRecipeById, getAllIngredientNames, getRecipeCount } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB schema on startup
initSchema();

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/recipes — list all recipes with ingredient names
app.get('/api/recipes', (req, res) => {
  try {
    const recipes = getAllRecipes();
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id — full recipe detail
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = getRecipeById(decodeURIComponent(req.params.id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// GET /api/ingredients — all unique ingredient names
app.get('/api/ingredients', (req, res) => {
  try {
    const ingredients = getAllIngredientNames();
    res.json(ingredients);
  } catch (err) {
    console.error('Error fetching ingredients:', err);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// GET /api/stats — quick stats
app.get('/api/stats', (req, res) => {
  try {
    const count = getRecipeCount();
    res.json({ recipeCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`SKit API server running at http://localhost:${PORT}`);
  console.log(`  GET /api/recipes      — list all recipes`);
  console.log(`  GET /api/recipes/:id  — recipe detail`);
  console.log(`  GET /api/ingredients  — all ingredient names`);
  console.log(`  GET /api/stats        — recipe count`);
  console.log(`\nTotal recipes in DB: ${getRecipeCount()}`);
});

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

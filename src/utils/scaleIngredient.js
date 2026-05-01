import { MIN_SERVINGS, MAX_SERVINGS } from './constants'

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

  const rounded = Math.abs(scaledQty - Math.round(scaledQty)) < 0.1
    ? Math.round(scaledQty)
    : Math.round(scaledQty * 10) / 10

  return { ...ingredient, qty: rounded, display: `${rounded}${ingredient.unit || ''}` }
}

export function scaleIngredients(ingredients, servings) {
  return ingredients.map(ing => scaleIngredient(ing, servings))
}

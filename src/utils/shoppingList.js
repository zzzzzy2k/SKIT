export function generateShoppingList(scaledIngredients) {
  return scaledIngredients.map(ing => ({
    name: ing.name,
    text: `${ing.name} ${ing.display || (ing.qty !== null ? `${ing.qty}${ing.unit || ''}` : '适量')}`,
  }))
}

export function formatShoppingList(items, recipeTitle) {
  const lines = [
    `购物清单 - ${recipeTitle}`,
    '─'.repeat(20),
    ...items.map(item => `- ${item.text}`),
    '',
    '— 由「食刻」生成',
  ]
  return lines.join('\n')
}

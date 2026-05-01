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
      <p className="text-yellow-500 mb-1">{stars}</p>
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

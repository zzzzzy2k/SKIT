import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRecipeDetail } from '../hooks/useRecipeDetail'
import { useFavorites } from '../hooks/useFavorites'
import { scaleIngredients } from '../utils/scaleIngredient'
import { DEFAULT_SERVINGS } from '../utils/constants'
import ServingSelector from '../components/ServingSelector'
import ShoppingListModal from '../components/ShoppingListModal'
import EmptyState from '../components/EmptyState'

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function HeartIcon({ className, filled }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? '#e74c3c' : 'none'} stroke={filled ? '#e74c3c' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

function CartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function StarRating({ difficulty }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: difficulty }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-sm text-warm-400 ml-0.5">{difficulty}/5</span>
    </div>
  )
}

const categoryLabels = {
  meat_dish: '荤菜', vegetable_dish: '素菜', soup: '汤类',
  aquatic: '水产', breakfast: '早餐', dessert: '甜品',
  drink: '饮品', staple: '主食', condiment: '调味',
  'semi-finished': '半成品',
}

export default function RecipeDetail() {
  const { id } = useParams()
  const decodedId = decodeURIComponent(id)
  const { recipe, loading, error } = useRecipeDetail(decodedId)
  const { isFavorite, toggleFavorite } = useFavorites()
  const [servings, setServings] = useState(DEFAULT_SERVINGS)
  const [showShoppingList, setShowShoppingList] = useState(false)

  const scaledIngredients = useMemo(
    () => recipe ? scaleIngredients(recipe.parsed_ingredients, servings) : [],
    [recipe, servings]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !recipe) {
    return <EmptyState message={error || "菜谱未找到"} actionText="返回首页" actionTo="/" />
  }

  const fav = isFavorite(recipe.id)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>返回首页</span>
        </Link>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className="p-2 rounded-full hover:bg-warm-100 transition-colors cursor-pointer"
          aria-label={fav ? '取消收藏' : '收藏'}
        >
          <HeartIcon className="w-6 h-6 text-warm-600" filled={fav} />
        </button>
      </div>

      {/* Hero card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {categoryLabels[recipe.category] || recipe.category}
          </span>
          <StarRating difficulty={recipe.difficulty} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-warm-800 mb-2">{recipe.title}</h1>
        <p className="text-sm text-warm-400">
          难度 {recipe.difficulty}/5 · {recipe.steps.length} 个步骤 · {recipe.parsed_ingredients.length} 种食材
        </p>
      </div>

      {/* Serving selector */}
      <div className="glass-card rounded-2xl p-5">
        <ServingSelector value={servings} onChange={setServings} />
      </div>

      {/* Ingredients */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-400 rounded-full" />
          食材清单
        </h2>
        <ul className="divide-y divide-warm-100">
          {scaledIngredients.map((ing, i) => (
            <li key={i} className="flex items-center justify-between py-2.5">
              <span className="text-warm-700">{ing.name}</span>
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
                {ing.qty !== null ? `${ing.qty}${ing.unit || ''}` : '适量'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      {recipe.tools.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-warm-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-olive-400 rounded-full" />
            所需工具
          </h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tools.map((tool, i) => (
              <span key={i} className="text-sm text-warm-600 bg-olive-50 px-3 py-1 rounded-full">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent-400 rounded-full" />
          操作步骤
        </h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-accent-50 text-accent-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </span>
              <p className="text-warm-600 leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-warm-400 rounded-full" />
            附加内容
          </h2>
          <ul className="space-y-2.5">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-warm-600 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-warm-300 rounded-full flex-shrink-0 mt-2" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => setShowShoppingList(true)}
        className="w-full flex items-center justify-center gap-2.5 bg-primary-500 text-white py-4 rounded-2xl text-lg font-medium
                   shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5
                   active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <CartIcon className="w-5 h-5" />
        <span>生成购物清单</span>
      </button>

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

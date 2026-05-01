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

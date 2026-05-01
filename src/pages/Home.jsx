import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { filterRecipes } from '../utils/filterRecipes'
import IngredientFilter from '../components/IngredientFilter'
import RecipeCard from '../components/RecipeCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

function DiceIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

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
    return <EmptyState message={`加载失败: ${error}`} actionText="重试" actionTo="/" />
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-hero-gradient px-6 py-12 sm:py-16 text-center">
        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-4xl opacity-20 animate-float">🥬</div>
        <div className="absolute top-6 right-12 text-3xl opacity-20 animate-float delay-200">🍳</div>
        <div className="absolute bottom-4 left-16 text-3xl opacity-15 animate-float delay-400">🧄</div>
        <div className="absolute bottom-6 right-8 text-4xl opacity-15 animate-float delay-300">🍅</div>

        <div className="relative z-10 animate-fade-in-up">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-warm-800 mb-3 text-balance">
            今天吃什么？
          </h1>
          <p className="text-warm-500 text-lg mb-2 max-w-md mx-auto">
            让「食刻」帮你决定
          </p>
          <p className="text-warm-400 text-sm mb-8 max-w-sm mx-auto">
            从 {recipes.length} 道家常菜中，找到你此刻最想做的那一道
          </p>

          <button
            onClick={handleRandom}
            disabled={loading || filtered.length === 0}
            className="inline-flex items-center gap-2.5 bg-primary-500 text-white px-8 py-3.5 rounded-2xl text-lg font-medium
                       shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30
                       hover:-translate-y-0.5 active:translate-y-0
                       disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg
                       transition-all duration-200 cursor-pointer"
          >
            <DiceIcon className="w-5 h-5" />
            <span>随机推荐</span>
          </button>
        </div>
      </section>

      {/* Stats bar */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-200">
          <div className="glass-card rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-primary-600">{recipes.length}</p>
            <p className="text-xs text-warm-400">道菜谱</p>
          </div>
          <div className="glass-card rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-olive-500">
              {new Set(recipes.flatMap(r => r.ingredients)).size}
            </p>
            <p className="text-xs text-warm-400">种食材</p>
          </div>
          <div className="glass-card rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-accent-500">{favorites.length}</p>
            <p className="text-xs text-warm-400">已收藏</p>
          </div>
        </div>
      )}

      {/* Ingredient filter */}
      {!loading && recipes.length > 0 && (
        <section className="glass-card rounded-2xl p-5 animate-fade-in-up delay-300">
          <IngredientFilter
            recipes={recipes}
            selected={selectedIngredients}
            onChange={setSelectedIngredients}
          />
        </section>
      )}

      {/* Fallback notice */}
      {isFallback && filtered.length > 0 && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sm text-primary-700 animate-fade-in">
          <SearchIcon className="w-4 h-4 flex-shrink-0" />
          <span>未找到同时包含这些食材的菜谱，以下菜谱至少包含其中一种。</span>
          <button onClick={() => setSelectedIngredients([])} className="ml-auto text-xs font-medium text-primary-600 hover:underline cursor-pointer whitespace-nowrap">
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
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-warm-700">
              {selectedIngredients.length > 0 ? '筛选结果' : '全部菜谱'}
            </h2>
            <span className="text-sm text-warm-400">{filtered.length} 道</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((recipe, i) => (
              <div
                key={recipe.id}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
              >
                <RecipeCard
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

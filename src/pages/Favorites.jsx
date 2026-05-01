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

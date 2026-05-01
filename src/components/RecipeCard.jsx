import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const stars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty)

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow relative">
      <Link to={`/recipe/${encodeURIComponent(recipe.id)}`} className="block">
        <h3 className="font-medium text-gray-900 mb-1">{recipe.title}</h3>
        <p className="text-sm text-yellow-500 mb-2">{stars}</p>
        <p className="text-sm text-gray-400">
          {recipe.ingredients.slice(0, 4).join('、')}
          {recipe.ingredients.length > 4 && '...'}
        </p>
      </Link>
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(recipe.id) }}
          className="absolute top-3 right-3 text-lg"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}

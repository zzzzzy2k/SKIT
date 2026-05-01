import { Link } from 'react-router-dom'

function StarRating({ difficulty }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={i < difficulty ? '#f59e0b' : 'none'} stroke={i < difficulty ? '#f59e0b' : '#d1d5db'} strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function HeartButton({ isFavorite, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
      aria-label={isFavorite ? '取消收藏' : '收藏'}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorite ? '#e74c3c' : 'none'} stroke={isFavorite ? '#e74c3c' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    </button>
  )
}

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const categoryLabels = {
    meat_dish: '荤菜', vegetable_dish: '素菜', soup: '汤类',
    aquatic: '水产', breakfast: '早餐', dessert: '甜品',
    drink: '饮品', staple: '主食', condiment: '调味',
    'semi-finished': '半成品',
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group">
      {/* Header: category + difficulty + heart */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
          {categoryLabels[recipe.category] || recipe.category}
        </span>
        <div className="flex items-center gap-2">
          <StarRating difficulty={recipe.difficulty} />
          {onToggleFavorite && (
            <HeartButton
              isFavorite={isFavorite}
              onClick={(e) => { e.preventDefault(); onToggleFavorite(recipe.id) }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/recipe/${encodeURIComponent(recipe.id)}`} className="block px-4 pb-4">
        <h3 className="font-display text-lg font-semibold text-warm-800 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients.slice(0, 5).map((ing, i) => (
            <span key={i} className="text-xs text-warm-500 bg-warm-100/60 px-2 py-0.5 rounded-full">
              {ing}
            </span>
          ))}
          {recipe.ingredients.length > 5 && (
            <span className="text-xs text-warm-400">+{recipe.ingredients.length - 5}</span>
          )}
        </div>
      </Link>
    </div>
  )
}

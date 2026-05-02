import { useMemo } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { useHistory } from '../hooks/useHistory'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'
import SkeletonCard from '../components/SkeletonCard'

function TrashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 个月前`
}

export default function History() {
  const { recipes, loading } = useRecipes()
  const { history, clearHistory, hasHistory } = useHistory()

  const historyRecipes = useMemo(() => {
    const recipeMap = new Map(recipes.map(r => [r.id, r]))
    return history
      .map(item => ({ ...item, recipe: recipeMap.get(item.id) }))
      .filter(item => item.recipe)
  }, [recipes, history])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!hasHistory) {
    return <EmptyState message="暂无浏览记录，去首页探索吧" actionText="去首页" actionTo="/" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-warm-800">浏览历史</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-warm-400">{historyRecipes.length} 道</span>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-warm-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            <span>清空</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {historyRecipes.map((item, i) => (
          <div
            key={item.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <RecipeCard recipe={item.recipe} />
            <p className="text-xs text-warm-400 mt-1.5 text-right">
              {formatRelativeTime(item.time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

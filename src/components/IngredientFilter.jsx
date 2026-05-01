import { useState, useMemo } from 'react'

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function IngredientFilter({ recipes, selected, onChange }) {
  const [search, setSearch] = useState('')

  const allIngredients = useMemo(() => {
    const set = new Set()
    recipes.forEach(r => r.ingredients.forEach(i => set.add(i)))
    return [...set].sort()
  }, [recipes])

  const filtered = useMemo(() => {
    if (!search) return allIngredients
    return allIngredients.filter(i => i.includes(search))
  }, [allIngredients, search])

  const toggle = (ingredient) => {
    if (selected.includes(ingredient)) {
      onChange(selected.filter(i => i !== ingredient))
    } else {
      onChange([...selected, ingredient])
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-warm-700">按食材筛选</h2>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <XIcon className="w-3.5 h-3.5" />
            <span>清除全部 ({selected.length})</span>
          </button>
        )}
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
        <input
          type="text"
          placeholder="搜索食材..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm
                     placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300
                     transition-all duration-200"
        />
      </div>

      {/* Selected ingredients */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-warm-100">
          {selected.map(ingredient => (
            <button
              key={ingredient}
              onClick={() => toggle(ingredient)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium
                         hover:bg-primary-600 transition-colors duration-150 cursor-pointer"
            >
              {ingredient}
              <XIcon className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* All ingredients */}
      <div className="flex flex-wrap gap-2">
        {filtered.map(ingredient => {
          const isSelected = selected.includes(ingredient)
          return (
            <button
              key={ingredient}
              onClick={() => toggle(ingredient)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-warm-100 text-warm-600 hover:bg-warm-200 hover:text-warm-700'
              }`}
            >
              {ingredient}
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-warm-400 py-2">没有找到匹配的食材</p>
        )}
      </div>
    </div>
  )
}

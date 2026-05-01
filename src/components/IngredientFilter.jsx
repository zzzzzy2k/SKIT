import { useState, useMemo } from 'react'

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
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium text-gray-700">按食材筛选</h2>
        {selected.length > 0 && (
          <button onClick={() => onChange([])} className="text-sm text-primary-600">
            清除全部
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="搜索食材..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {filtered.map(ingredient => (
          <button
            key={ingredient}
            onClick={() => toggle(ingredient)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selected.includes(ingredient)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {ingredient}
          </button>
        ))}
      </div>
    </div>
  )
}

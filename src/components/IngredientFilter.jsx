import { useState, useMemo } from 'react'
import { SEASONING_SET } from '../utils/constants'

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

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'vegetable', label: '蔬菜' },
  { key: 'meat', label: '肉类' },
  { key: 'seafood', label: '海鲜' },
  { key: 'staple', label: '主食' },
  { key: 'egg_dairy', label: '蛋奶豆' },
  { key: 'seasoning', label: '调料' },
  { key: 'other', label: '其他' },
]

const MEAT_KEYWORDS = [
  '猪', '牛', '羊', '鸡', '鸭', '鹅', '肉', '排骨', '里脊', '五花',
  '腿', '翅', '胸', '肝', '心', '肚', '肠', '腰', '舌', '蹄',
  '培根', '火腿', '腊肉', '香肠', '午餐肉', '肉丸',
]
const SEAFOOD_KEYWORDS = [
  '鱼', '虾', '蟹', '贝', '螺', '鱿', '墨', '海参', '鲍', '蛤',
  '蚝', '牡蛎', '龙虾', '三文鱼', '鲈', '鲫', '草鱼', '鲢', '带鱼',
  '黄鱼', '鳕鱼', '鳗', '鲷', '虾仁', '虾米', '干贝', '紫菜', '海带',
]
const VEGETABLE_KEYWORDS = [
  '菜', '瓜', '豆', '笋', '菇', '菌', '耳', '藕', '茄', '椒',
  '萝卜', '土豆', '番茄', '西红柿', '白菜', '青菜', '菠菜', '芹菜',
  '韭菜', '生菜', '油麦', '西兰花', '花菜', '莴笋', '洋葱', '大蒜',
  '蒜苗', '蒜薹', '茼蒿', '空心菜', '苋菜', '芥蓝', '苦瓜', '丝瓜',
  '黄瓜', '冬瓜', '南瓜', '西葫芦', '玉米', '毛豆', '豌豆', '扁豆',
  '四季豆', '芸豆', '蘑菇', '香菇', '金针菇', '杏鲍菇', '木耳',
  '腐竹', '豆芽', '豆皮', '豆腐',
]
const STAPLE_KEYWORDS = [
  '米', '面', '粉', '馒头', '饺子', '馄饨', '包子', '饼', '年糕',
  '面条', '挂面', '方便面', '意面', '意大利面', '面包', '吐司',
  '糯米', '燕麦', '藜麦', '红薯', '紫薯', '芋头', '山药',
]
const EGG_DAIRY_KEYWORDS = [
  '蛋', '奶', '芝士', '奶酪', '黄油', '奶油', '酸奶', '豆腐',
  '豆浆', '豆干', '千张', '腐皮',
]

function classifyIngredient(name) {
  if (SEASONING_SET.has(name)) return 'seasoning'
  if (MEAT_KEYWORDS.some(k => name.includes(k))) return 'meat'
  if (SEAFOOD_KEYWORDS.some(k => name.includes(k))) return 'seafood'
  if (STAPLE_KEYWORDS.some(k => name.includes(k))) return 'staple'
  if (EGG_DAIRY_KEYWORDS.some(k => name.includes(k))) return 'egg_dairy'
  if (VEGETABLE_KEYWORDS.some(k => name.includes(k))) return 'vegetable'
  return 'other'
}

const DEFAULT_VISIBLE = 30

export default function IngredientFilter({ recipes, selected, onChange }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expanded, setExpanded] = useState(false)

  const { allIngredients, ingredientCategory } = useMemo(() => {
    const countMap = new Map()
    const catMap = new Map()
    recipes.forEach(r =>
      r.ingredients.forEach(i => {
        countMap.set(i, (countMap.get(i) || 0) + 1)
        if (!catMap.has(i)) catMap.set(i, classifyIngredient(i))
      })
    )
    const sorted = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
    return { allIngredients: sorted, ingredientCategory: catMap }
  }, [recipes])

  const filtered = useMemo(() => {
    let list = allIngredients
    if (activeCategory !== 'all') {
      list = list.filter(i => ingredientCategory.get(i) === activeCategory)
    }
    if (search) {
      list = list.filter(i => i.includes(search))
    }
    return list
  }, [allIngredients, ingredientCategory, activeCategory, search])

  const visibleItems = expanded ? filtered : filtered.slice(0, DEFAULT_VISIBLE)
  const hasMore = filtered.length > DEFAULT_VISIBLE

  const toggle = (ingredient) => {
    if (selected.includes(ingredient)) {
      onChange(selected.filter(i => i !== ingredient))
    } else {
      onChange([...selected, ingredient])
    }
  }

  const categoryCounts = useMemo(() => {
    const counts = { all: allIngredients.length }
    CATEGORIES.forEach(c => {
      if (c.key !== 'all') {
        counts[c.key] = allIngredients.filter(i => ingredientCategory.get(i) === c.key).length
      }
    })
    return counts
  }, [allIngredients, ingredientCategory])

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
      <div className="relative mb-3">
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

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CATEGORIES.map(cat => {
          const count = categoryCounts[cat.key] || 0
          if (count === 0 && cat.key !== 'all') return null
          return (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setExpanded(false) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-warm-100 text-warm-500 hover:bg-warm-200 hover:text-warm-700'
              }`}
            >
              {cat.label}
              <span className="ml-1 opacity-70">{count}</span>
            </button>
          )
        })}
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

      {/* Ingredient pills */}
      <div className="flex flex-wrap gap-2">
        {visibleItems.map(ingredient => {
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

      {/* Expand/collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mx-auto mt-3 px-4 py-1.5 text-sm text-warm-500 hover:text-primary-500
                     transition-colors cursor-pointer"
        >
          <span>{expanded ? '收起' : `展开全部 (${filtered.length})`}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}

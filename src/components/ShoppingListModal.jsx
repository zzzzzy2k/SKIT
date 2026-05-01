import { useState } from 'react'
import { generateShoppingList, formatShoppingList } from '../utils/shoppingList'

export default function ShoppingListModal({ scaledIngredients, recipeTitle, onClose }) {
  const [copied, setCopied] = useState(false)
  const items = generateShoppingList(scaledIngredients)
  const text = formatShoppingList(items, recipeTitle)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="glass-strong rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold text-warm-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          购物清单
        </h3>
        <div className="bg-warm-50 rounded-xl p-4 mb-5 max-h-60 overflow-y-auto">
          <p className="font-semibold text-warm-700 mb-3">{recipeTitle}</p>
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-warm-600">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-olive-500 text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm'
            }`}
          >
            {copied ? '已复制 ✓' : '复制到剪贴板'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 text-warm-500 hover:text-warm-700 transition-colors cursor-pointer rounded-xl">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

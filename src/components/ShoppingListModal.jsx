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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">🛒 购物清单</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
          <p className="font-medium mb-2">{recipeTitle}</p>
          {items.map((item, i) => (
            <p key={i} className="text-sm text-gray-700">• {item.text}</p>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-primary-500 text-white py-2 rounded-lg"
          >
            {copied ? '已复制 ✓' : '复制到剪贴板'}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-gray-500">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

import { describe, it, expect } from 'vitest'
import { generateShoppingList, formatShoppingList } from '../utils/shoppingList'

describe('generateShoppingList', () => {
  it('generates list from scaled ingredients', () => {
    const ingredients = [
      { name: '鸡蛋', qty: 6, unit: '个' },
      { name: '番茄', qty: 4, unit: '个' },
    ]
    const result = generateShoppingList(ingredients)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ name: '鸡蛋', text: '鸡蛋 6个' })
  })

  it('shows 适量 when qty is null', () => {
    const ingredients = [
      { name: '盐', qty: null, unit: null, display: '适量' },
    ]
    const result = generateShoppingList(ingredients)
    expect(result[0].text).toBe('盐 适量')
  })
})

describe('formatShoppingList', () => {
  it('formats list as plain text', () => {
    const items = [
      { name: '鸡蛋', text: '鸡蛋 6个' },
      { name: '番茄', text: '番茄 4个' },
    ]
    const result = formatShoppingList(items, '番茄炒蛋')
    expect(result).toContain('番茄炒蛋')
    expect(result).toContain('鸡蛋 6个')
    expect(result).toContain('番茄 4个')
  })
})

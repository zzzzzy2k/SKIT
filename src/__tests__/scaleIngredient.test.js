import { describe, it, expect } from 'vitest'
import { scaleIngredient, scaleIngredients } from '../utils/scaleIngredient'

describe('scaleIngredient', () => {
  it('scales main ingredients linearly', () => {
    const result = scaleIngredient({ name: '鸡蛋', qty: 3, unit: '个', is_seasoning: false }, 4)
    expect(result.qty).toBe(12)
  })

  it('scales seasonings with power-law coefficient', () => {
    const result = scaleIngredient({ name: '盐', qty: 3, unit: '克', is_seasoning: true }, 4)
    // 3 * 4^0.7 ≈ 7.917 → rounded to 8
    expect(result.qty).toBe(8)
  })

  it('returns null qty for non-numeric ingredients', () => {
    const result = scaleIngredient({ name: '盐', qty: null, unit: null, raw: '适量' }, 4)
    expect(result.qty).toBeNull()
    expect(result.display).toBe('~适量')
  })

  it('handles serving count of 1 (no scaling)', () => {
    const result = scaleIngredient({ name: '番茄', qty: 2, unit: '个', is_seasoning: false }, 1)
    expect(result.qty).toBe(2)
  })
})

describe('scaleIngredients', () => {
  it('scales a list of ingredients', () => {
    const ingredients = [
      { name: '鸡蛋', qty: 3, unit: '个', is_seasoning: false },
      { name: '盐', qty: 3, unit: '克', is_seasoning: true },
    ]
    const result = scaleIngredients(ingredients, 2)
    expect(result[0].qty).toBe(6)
    expect(result[1].qty).toBe(4.9) // 3 * 2^0.7 ≈ 4.87 → 4.9
  })
})

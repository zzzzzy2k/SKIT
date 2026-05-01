import { describe, it, expect } from 'vitest'
import { filterRecipes } from '../utils/filterRecipes'

const recipes = [
  { id: '1', title: '番茄炒蛋', ingredients: ['鸡蛋', '番茄', '盐'] },
  { id: '2', title: '蛋炒饭', ingredients: ['鸡蛋', '米饭', '盐', '葱'] },
  { id: '3', title: '红烧肉', ingredients: ['五花肉', '酱油', '糖', '姜'] },
  { id: '4', title: '凉拌黄瓜', ingredients: ['黄瓜', '醋', '蒜', '辣椒'] },
]

describe('filterRecipes', () => {
  it('returns all recipes when no ingredients selected', () => {
    const result = filterRecipes(recipes, [])
    expect(result.recipes).toHaveLength(4)
    expect(result.isFallback).toBe(false)
  })

  it('returns matching recipes with AND logic', () => {
    const result = filterRecipes(recipes, ['鸡蛋', '番茄'])
    expect(result.recipes).toHaveLength(1)
    expect(result.recipes[0].id).toBe('1')
    expect(result.isFallback).toBe(false)
  })

  it('falls back to OR logic when AND returns empty', () => {
    const result = filterRecipes(recipes, ['鸡蛋', '五花肉'])
    expect(result.isFallback).toBe(true)
    expect(result.recipes.length).toBeGreaterThan(0)
    const ids = result.recipes.map(r => r.id)
    expect(ids).toContain('1')
    expect(ids).toContain('2')
    expect(ids).toContain('3')
  })

  it('returns empty with fallback=true when OR also returns empty', () => {
    const result = filterRecipes(recipes, ['不存在的食材'])
    expect(result.recipes).toHaveLength(0)
    expect(result.isFallback).toBe(true)
  })

  it('handles single ingredient selection', () => {
    const result = filterRecipes(recipes, ['盐'])
    expect(result.isFallback).toBe(false)
    expect(result.recipes).toHaveLength(2)
  })
})

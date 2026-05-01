import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../hooks/useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a recipe to favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.favorites).toContain('番茄炒蛋')
  })

  it('removes a recipe from favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.favorites).not.toContain('番茄炒蛋')
  })

  it('checks if a recipe is favorited', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('番茄炒蛋')).toBe(false)
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    expect(result.current.isFavorite('番茄炒蛋')).toBe(true)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('番茄炒蛋'))
    const stored = JSON.parse(localStorage.getItem('skit_favorites'))
    expect(stored).toContain('番茄炒蛋')
  })
})

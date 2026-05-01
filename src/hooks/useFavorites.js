import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'skit_favorites'

export function useFavorites() {
  const [favorites, setFavorites, isAvailable] = useLocalStorage(STORAGE_KEY, [])

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId)
      }
      return [...prev, recipeId]
    })
  }

  const isFavorite = (recipeId) => favorites.includes(recipeId)

  return { favorites, toggleFavorite, isFavorite, isAvailable }
}

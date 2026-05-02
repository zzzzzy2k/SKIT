import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'skit_history'
const MAX_HISTORY = 50

export function useHistory() {
  const [history, setHistory, isAvailable] = useLocalStorage(STORAGE_KEY, [])

  const addToHistory = (recipeId) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== recipeId)
      return [{ id: recipeId, time: Date.now() }, ...filtered].slice(0, MAX_HISTORY)
    })
  }

  const clearHistory = () => setHistory([])

  const hasHistory = history.length > 0

  return { history, addToHistory, clearHistory, hasHistory, isAvailable }
}

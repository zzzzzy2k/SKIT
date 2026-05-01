import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
      setIsAvailable(true)
    } catch {
      setIsAvailable(false)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue, isAvailable]
}

import { useState, useEffect } from 'react'

let cache = null

export function useRecipes() {
  const [recipes, setRecipes] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return

    setLoading(true)
    fetch('/api/recipes')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load recipes: ${res.status}`)
        return res.json()
      })
      .then(data => {
        cache = data
        setRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { recipes, loading, error }
}

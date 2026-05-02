import { useState, useEffect } from 'react'

const detailCache = new Map()

export function useRecipeDetail(id) {
  const [recipe, setRecipe] = useState(detailCache.get(id) || null)
  const [loading, setLoading] = useState(!detailCache.has(id))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    if (detailCache.has(id)) {
      setRecipe(detailCache.get(id))
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/recipes/${encodeURIComponent(id)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Recipe not found: ${res.status}`)
        return res.json()
      })
      .then(data => {
        detailCache.set(id, data)
        setRecipe(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return { recipe, loading, error }
}

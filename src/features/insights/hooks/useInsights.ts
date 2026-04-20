'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { InsightsData } from '@/features/market/types'

export default function useInsights() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    api
      .get<InsightsData>('/insights')
      .then(({ data }) => {
        if (mounted) {
          setInsights(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to load insights')
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { insights, loading, error }
}

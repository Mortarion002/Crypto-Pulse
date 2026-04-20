'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { AxiosError } from 'axios'

import type { InsightsData } from '@/features/market/types'
import api from '@/lib/api'

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to load insights'
}

export function useInsights() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = useEffectEvent(async () => {
    try {
      setLoading(true)
      const response = await api.get<InsightsData>('/insights')
      setInsights(response.data)
      setError(null)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    void loadInsights()

    const intervalId = window.setInterval(() => {
      void loadInsights()
    }, 60_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return {
    insights,
    loading,
    error,
  }
}

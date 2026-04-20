'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { AxiosError } from 'axios'

import { getMarketData } from '@/features/market/services/marketService'
import { useMarketStore } from '@/store/marketStore'

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to load market data'
}

export function useMarketData() {
  const coins = useMarketStore((state) => state.coins)
  const loading = useMarketStore((state) => state.loading)
  const setCoins = useMarketStore((state) => state.setCoins)
  const setLoading = useMarketStore((state) => state.setLoading)
  const [error, setError] = useState<string | null>(null)

  const loadMarketData = useEffectEvent(async () => {
    try {
      setLoading(true)
      const data = await getMarketData()
      setCoins(data)
      setError(null)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    void loadMarketData()

    const intervalId = window.setInterval(() => {
      void loadMarketData()
    }, 30_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return {
    coins,
    loading,
    error,
    refresh: () => {
      void loadMarketData()
    },
  }
}

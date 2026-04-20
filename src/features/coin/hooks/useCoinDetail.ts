'use client'

import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'

import { getCoinKlines } from '@/features/coin/services/coinService'
import type { KlineData } from '@/features/market/types'

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to load coin detail'
}

export function useCoinDetail(symbol: string, interval: string) {
  const [klines, setKlines] = useState<KlineData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadCoinDetail() {
      try {
        setLoading(true)
        const data = await getCoinKlines(symbol, interval)

        if (!isActive) {
          return
        }

        setKlines(data)
        setError(null)
      } catch (loadError) {
        if (!isActive) {
          return
        }

        setError(getErrorMessage(loadError))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadCoinDetail()

    return () => {
      isActive = false
    }
  }, [interval, symbol])

  return {
    klines,
    loading,
    error,
  }
}

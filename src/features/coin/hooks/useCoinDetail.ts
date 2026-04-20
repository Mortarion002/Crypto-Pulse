'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { KlineData } from '@/features/market/types'

export default function useCoinDetail(
  symbol: string,
  interval: '1h' | '4h' | '1d' | '1w'
) {
  const [klines, setKlines] = useState<KlineData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    api
      .get<KlineData[]>(`/coin/${symbol}`, { params: { interval } })
      .then(({ data }) => {
        if (mounted) {
          setKlines(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to load chart data')
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [symbol, interval])

  return { klines, loading, error }
}

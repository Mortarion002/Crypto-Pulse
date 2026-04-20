'use client'

import { useEffect, useCallback } from 'react'
import api from '@/lib/api'
import type { CoinData } from '../types'
import useMarketStore from '../store/marketStore'

export default function useMarketData() {
  const { coins, loading, error, lastUpdated, setCoins, setLoading, setError, setLastUpdated } =
    useMarketStore()

  const fetchCoins = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get<CoinData[]>('/market')
      setCoins(data)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Failed to load market data')
    } finally {
      setLoading(false)
    }
  }, [setCoins, setError, setLastUpdated, setLoading])

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 30_000)
    return () => clearInterval(interval)
  }, [fetchCoins])

  return { coins, loading, error, lastUpdated, refresh: fetchCoins }
}

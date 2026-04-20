import { create } from 'zustand'
import type { CoinData } from '../types'

interface MarketState {
  coins: CoinData[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  setCoins: (coins: CoinData[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setLastUpdated: (date: Date) => void
}

const useMarketStore = create<MarketState>((set) => ({
  coins: [],
  loading: false,
  error: null,
  lastUpdated: null,
  setCoins: (coins) => set({ coins }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
}))

export default useMarketStore

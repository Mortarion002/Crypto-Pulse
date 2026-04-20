import { create } from 'zustand'

import type { CoinData } from '@/features/market/types'

interface MarketStore {
  coins: CoinData[]
  loading: boolean
  lastUpdated: Date | null
  setCoins: (coins: CoinData[]) => void
  setLoading: (loading: boolean) => void
}

export const useMarketStore = create<MarketStore>((set) => ({
  coins: [],
  loading: false,
  lastUpdated: null,
  setCoins: (coins) => set({ coins, lastUpdated: new Date() }),
  setLoading: (loading) => set({ loading }),
}))

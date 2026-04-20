import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WatchlistStore {
  savedCoins: string[]
  addCoin: (symbol: string) => void
  removeCoin: (symbol: string) => void
}

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase()
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      savedCoins: [],
      addCoin: (symbol) =>
        set((state) => {
          const normalizedSymbol = normalizeSymbol(symbol)

          if (normalizedSymbol.length === 0) {
            return state
          }

          if (state.savedCoins.includes(normalizedSymbol)) {
            return state
          }

          return {
            savedCoins: [...state.savedCoins, normalizedSymbol],
          }
        }),
      removeCoin: (symbol) =>
        set((state) => {
          const normalizedSymbol = normalizeSymbol(symbol)

          return {
            savedCoins: state.savedCoins.filter(
              (savedSymbol) => savedSymbol !== normalizedSymbol
            ),
          }
        }),
    }),
    {
      name: 'crypto-pulse-watchlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedCoins: state.savedCoins,
      }),
    }
  )
)

'use client'

import { useWatchlistStore } from '@/store/watchlistStore'

export function useWatchlist() {
  const savedCoins = useWatchlistStore((state) => state.savedCoins)
  const addCoin = useWatchlistStore((state) => state.addCoin)
  const removeCoin = useWatchlistStore((state) => state.removeCoin)

  return {
    savedCoins,
    addCoin,
    removeCoin,
    isWatchlisted: (symbol: string) =>
      savedCoins.includes(symbol.trim().toUpperCase()),
  }
}

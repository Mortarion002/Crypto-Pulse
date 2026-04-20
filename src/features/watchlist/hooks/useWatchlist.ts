'use client'

import useWatchlistStore from '../store/watchlistStore'

export default function useWatchlist() {
  const { savedCoins, addCoin, removeCoin, isWatchlisted } = useWatchlistStore()
  return { savedCoins, addCoin, removeCoin, isWatchlisted }
}

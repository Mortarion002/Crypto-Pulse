import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  savedCoins: string[]
  addCoin: (symbol: string) => void
  removeCoin: (symbol: string) => void
  isWatchlisted: (symbol: string) => boolean
}

const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      savedCoins: [],
      addCoin: (symbol) =>
        set((state) => ({
          savedCoins: state.savedCoins.includes(symbol)
            ? state.savedCoins
            : [...state.savedCoins, symbol],
        })),
      removeCoin: (symbol) =>
        set((state) => ({
          savedCoins: state.savedCoins.filter((s) => s !== symbol),
        })),
      isWatchlisted: (symbol) => get().savedCoins.includes(symbol),
    }),
    { name: 'cryptopulse-watchlist' }
  )
)

export default useWatchlistStore

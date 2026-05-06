import { create } from 'zustand'

interface WatchlistState {
  savedCoins: string[]
  loading: boolean
  error: string | null
  setSavedCoins: (symbols: string[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addCoin: (symbol: string) => void
  removeCoin: (symbol: string) => void
  isWatchlisted: (symbol: string) => boolean
}

const useWatchlistStore = create<WatchlistState>((set, get) => ({
  savedCoins: [],
  loading: false,
  error: null,
  setSavedCoins: (symbols) => set({ savedCoins: symbols }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
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
}))

export default useWatchlistStore

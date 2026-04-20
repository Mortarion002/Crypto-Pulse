import { create } from 'zustand'

interface UiStore {
  selectedCoin: string | null
  setSelectedCoin: (symbol: string | null) => void
}

export const useUiStore = create<UiStore>((set) => ({
  selectedCoin: null,
  setSelectedCoin: (selectedCoin) => set({ selectedCoin }),
}))

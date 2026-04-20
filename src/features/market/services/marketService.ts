import api from '@/lib/api'

import type { CoinData } from '@/features/market/types'

export async function getMarketData(): Promise<CoinData[]> {
  const response = await api.get<CoinData[]>('/market')
  return response.data
}

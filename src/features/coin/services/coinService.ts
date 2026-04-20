import api from '@/lib/api'

import type { KlineData } from '@/features/market/types'

export async function getCoinKlines(
  symbol: string,
  interval: string
): Promise<KlineData[]> {
  const response = await api.get<KlineData[]>(
    `/coin/${encodeURIComponent(symbol)}?interval=${encodeURIComponent(interval)}`
  )

  return response.data
}

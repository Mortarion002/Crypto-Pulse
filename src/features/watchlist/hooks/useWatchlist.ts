'use client'

import { useCallback, useEffect } from 'react'

import { useAuth } from '@/features/auth/AuthProvider'
import { getSupabaseBrowserClient } from '@/lib/supabase'

import useWatchlistStore from '../store/watchlistStore'

export default function useWatchlist() {
  const { user } = useAuth()
  const {
    savedCoins,
    loading,
    error,
    addCoin: addLocalCoin,
    removeCoin: removeLocalCoin,
    isWatchlisted,
    setError,
    setLoading,
    setSavedCoins,
  } = useWatchlistStore()

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedCoins([])
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error: queryError } = await supabase
        .from('watchlist_items')
        .select('symbol')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (queryError) throw queryError

      setSavedCoins((data ?? []).map((item) => item.symbol))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load watchlist')
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setSavedCoins, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addCoin = useCallback(
    async (symbol: string) => {
      if (!user || savedCoins.includes(symbol)) return

      addLocalCoin(symbol)
      try {
        const supabase = getSupabaseBrowserClient()
        const { error: insertError } = await supabase
          .from('watchlist_items')
          .insert({ user_id: user.id, symbol })

        if (insertError) throw insertError
        setError(null)
      } catch (err) {
        removeLocalCoin(symbol)
        setError(err instanceof Error ? err.message : 'Failed to save watchlist item')
      }
    },
    [addLocalCoin, removeLocalCoin, savedCoins, setError, user]
  )

  const removeCoin = useCallback(
    async (symbol: string) => {
      if (!user) return

      const previous = savedCoins
      removeLocalCoin(symbol)
      try {
        const supabase = getSupabaseBrowserClient()
        const { error: deleteError } = await supabase
          .from('watchlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('symbol', symbol)

        if (deleteError) throw deleteError
        setError(null)
      } catch (err) {
        setSavedCoins(previous)
        setError(err instanceof Error ? err.message : 'Failed to remove watchlist item')
      }
    },
    [removeLocalCoin, savedCoins, setError, setSavedCoins, user]
  )

  return { savedCoins, loading, error, addCoin, removeCoin, isWatchlisted, refresh }
}

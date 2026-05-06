'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from './AuthProvider'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { user, loading, signIn, signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSignup = mode === 'signup'

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, router, user])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isSignup) await signUp(email, password, name)
      else await signIn(email, password)

      const next =
        typeof window === 'undefined'
          ? '/dashboard'
          : new URLSearchParams(window.location.search).get('next') || '/dashboard'
      router.replace(next.startsWith('/auth') || next === '/' ? '/dashboard' : next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#0B0B0F] text-white lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden border-r border-[rgba(255,255,255,0.08)] bg-[#101018] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_28%_20%,rgba(0,255,133,0.18),transparent_70%),radial-gradient(600px_320px_at_78%_76%,rgba(155,109,255,0.16),transparent_72%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00FF85] text-sm font-black text-[#0B0B0F]">
              CP
            </span>
            <span className="text-xl font-bold">Crypto Pulse</span>
          </Link>

          <div className="max-w-xl">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#00FF85]">
              Shared cloud watchlist
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight">
              Carry your market pulse across web and mobile.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#A7A7B5]">
              Sign in with the same Supabase account used by the Flutter app and keep your saved coins in sync.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3">
            {['BTC', 'ETH', 'SOL'].map((symbol, index) => (
              <div
                key={symbol}
                className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4"
              >
                <p className="font-mono text-sm font-bold">{symbol}</p>
                <p className={index === 2 ? 'mt-3 text-sm font-semibold text-[#FF4D4D]' : 'mt-3 text-sm font-semibold text-[#00FF85]'}>
                  {index === 2 ? '-0.93%' : `+${(2.34 - index * 0.47).toFixed(2)}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00FF85] text-sm font-black text-[#0B0B0F]">
              CP
            </span>
            <span className="text-xl font-bold">Crypto Pulse</span>
          </Link>

          <div className="mb-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#00FF85]">
              {isSignup ? 'Create account' : 'Welcome back'}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {isSignup ? 'Start tracking smarter.' : 'Sign in to your dashboard.'}
            </h1>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <label className="flex flex-col gap-2 text-sm font-semibold text-[#CFCFD8]">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-12 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#13131A] px-4 text-white outline-none transition-colors focus:border-[#00FF85]"
                  placeholder="Satoshi Nakamoto"
                />
              </label>
            )}
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#CFCFD8]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#13131A] px-4 text-white outline-none transition-colors focus:border-[#00FF85]"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[#CFCFD8]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="h-12 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#13131A] px-4 text-white outline-none transition-colors focus:border-[#00FF85]"
                placeholder="Minimum 6 characters"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.08)] px-4 py-3 text-sm text-[#FF8A8A]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-12 rounded-lg bg-[#00FF85] text-sm font-black text-[#0B0B0F] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#8A8A9A]">
            {isSignup ? 'Already have an account?' : 'New to Crypto Pulse?'}{' '}
            <Link href={isSignup ? '/auth/login' : '/auth/signup'} className="font-semibold text-white hover:text-[#00FF85]">
              {isSignup ? 'Log in' : 'Create one'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { AuthProvider, useAuth } from './AuthProvider'

function GuardedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [loading, pathname, router, user])

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#8A8A9A]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00FF85]" />
          Checking session
        </div>
      </main>
    )
  }

  return children
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GuardedContent>{children}</GuardedContent>
    </AuthProvider>
  )
}

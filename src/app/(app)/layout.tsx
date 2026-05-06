'use client'

import AuthGuard from '@/features/auth/AuthGuard'
import Navbar from '@/shared/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Navbar />
      {children}
    </AuthGuard>
  )
}

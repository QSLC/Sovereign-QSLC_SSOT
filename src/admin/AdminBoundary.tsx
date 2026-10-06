import type { ReactNode } from 'react'
import type { AdminSession } from './types'
import { AdminUnavailable } from './AdminUnavailable'

export function AdminBoundary({session, children}:{session:AdminSession | null; children:ReactNode}) {
  if (!session?.authenticated || !session.authorized) return <AdminUnavailable />
  return <>{children}</>
}

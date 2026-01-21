import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '../types'
import { useAuthStore } from '../state/authStore'

export function RequireAuth({ roles }: { roles?: Role[] }) {
  const location = useLocation()
  const { user, isAuthorized } = useAuthStore()
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (roles && !isAuthorized(roles)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}

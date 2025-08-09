import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { Permission } from '@/lib/roles'

interface PermissionGuardProps {
  permission: Permission
  clubId?: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ permission, clubId, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading } = usePermissions(clubId)

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!checkPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

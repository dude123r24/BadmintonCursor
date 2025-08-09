import { useAuth } from '@/contexts/AuthContext'
import { hasPermission, canManageRole, Permission } from '@/lib/roles'
import { UserRole } from '@/types/database'
import { useState, useEffect } from 'react'
import { getUserRoleInClub } from '@/lib/database'

export function usePermissions(clubId?: string) {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserRole = async () => {
      if (!user || !clubId) {
        setUserRole(null)
        setLoading(false)
        return
      }

      const role = await getUserRoleInClub(user.id, clubId)
      setUserRole(role)
      setLoading(false)
    }

    loadUserRole()
  }, [user, clubId])

  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return hasPermission(userRole, permission)
  }

  const canManageUser = (targetRole: UserRole): boolean => {
    if (!userRole) return false
    return canManageRole(userRole, targetRole)
  }

  return {
    userRole,
    loading,
    checkPermission,
    canManageUser,
    isOwner: userRole === 'owner',
    isAdmin: userRole === 'admin' || userRole === 'owner',
    isMember: userRole === 'member' || userRole === 'admin' || userRole === 'owner',
  }
}

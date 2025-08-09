import { UserRole } from '@/types/database'

// Permission definitions
export const PERMISSIONS = {
  // Club management
  CLUB_CREATE: 'club:create',
  CLUB_READ: 'club:read',
  CLUB_UPDATE: 'club:update',
  CLUB_DELETE: 'club:delete',
  CLUB_MANAGE_MEMBERS: 'club:manage_members',

  // Session management
  SESSION_CREATE: 'session:create',
  SESSION_READ: 'session:read',
  SESSION_UPDATE: 'session:update',
  SESSION_DELETE: 'session:delete',
  SESSION_JOIN: 'session:join',

  // User management
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',

  // Game management
  GAME_CREATE: 'game:create',
  GAME_READ: 'game:read',
  GAME_UPDATE: 'game:update',
  GAME_DELETE: 'game:delete',

  // Analytics
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Role hierarchy and permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.CLUB_READ,
    PERMISSIONS.CLUB_UPDATE,
    PERMISSIONS.CLUB_MANAGE_MEMBERS,
    PERMISSIONS.SESSION_CREATE,
    PERMISSIONS.SESSION_READ,
    PERMISSIONS.SESSION_UPDATE,
    PERMISSIONS.SESSION_DELETE,
    PERMISSIONS.SESSION_JOIN,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.GAME_CREATE,
    PERMISSIONS.GAME_READ,
    PERMISSIONS.GAME_UPDATE,
    PERMISSIONS.GAME_DELETE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_EXPORT,
  ],
  member: [
    PERMISSIONS.CLUB_READ,
    PERMISSIONS.SESSION_READ,
    PERMISSIONS.SESSION_JOIN,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.GAME_CREATE,
    PERMISSIONS.GAME_READ,
    PERMISSIONS.GAME_UPDATE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  guest: [
    PERMISSIONS.CLUB_READ,
    PERMISSIONS.SESSION_READ,
  ],
}

// Role hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  guest: 1,
}

// Utility functions
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole]
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    guest: 'Guest',
  }
  return displayNames[role]
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    owner: 'bg-red-100 text-red-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-green-100 text-green-800',
    guest: 'bg-gray-100 text-gray-800',
  }
  return colors[role]
}

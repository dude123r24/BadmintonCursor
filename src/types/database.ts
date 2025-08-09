// Database types for Supabase
export type UserRole = 'owner' | 'admin' | 'member' | 'guest'
export type ClubStatus = 'active' | 'inactive' | 'suspended'
export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'expired'

// Database table types
export interface Club {
  id: string
  name: string
  description?: string
  location?: string
  contact_email?: string
  contact_phone?: string
  max_members: number
  status: ClubStatus
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  first_name?: string
  last_name?: string
  display_name?: string
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  skill_level: number
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ClubMembership {
  id: string
  club_id: string
  user_id: string
  role: UserRole
  status: MembershipStatus
  joined_at: string
  expires_at?: string
  invited_by?: string
  invitation_token?: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  created_at: string
}

export interface RolePermission {
  id: string
  role: UserRole
  permission_id: string
  created_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: Club
        Insert: Omit<Club, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Club, 'id' | 'created_at' | 'updated_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      club_memberships: {
        Row: ClubMembership
        Insert: Omit<ClubMembership, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ClubMembership, 'id' | 'created_at' | 'updated_at'>>
      }
      permissions: {
        Row: Permission
        Insert: Omit<Permission, 'id' | 'created_at'>
        Update: Partial<Omit<Permission, 'id' | 'created_at'>>
      }
      role_permissions: {
        Row: RolePermission
        Insert: Omit<RolePermission, 'id' | 'created_at'>
        Update: Partial<Omit<RolePermission, 'id' | 'created_at'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>
      }
    }
  }
}

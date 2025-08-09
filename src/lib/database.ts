import { createClient } from './supabase'
import { UserProfile, Club, ClubMembership } from '@/types/database'
import { UserRole } from '@/types/database'

// Type-safe Supabase client
export function createDatabaseClient() {
  return createClient()
}

// User profile utilities
export async function getUserProfile(userId: string) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single()
  
  return { data, error }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Club utilities
export async function getClubs() {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getClub(clubId: string) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', clubId)
    .single()
  
  return { data, error }
}

export async function createClub(club: Omit<Club, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('clubs')
    .insert(club)
    .select()
    .single()
  
  return { data, error }
}

// Membership utilities
export async function getUserMemberships(userId: string) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('club_memberships')
    .select(`
      *,
      clubs (*)
    `)
    .eq('user_id', userId)
  
  return { data, error }
}

export async function getClubMembers(clubId: string) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('club_memberships')
    .select(`
      *,
      user_profiles (*)
    `)
    .eq('club_id', clubId)
  
  return { data, error }
}

export async function getUserRoleInClub(userId: string, clubId: string): Promise<UserRole | null> {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('club_memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('club_id', clubId)
    .single()
  
  if (error || !data) return null
  return data.role
}

export async function addMemberToClub(membership: Omit<ClubMembership, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('club_memberships')
    .insert(membership)
    .select()
    .single()
  
  return { data, error }
}

export async function updateMemberRole(clubId: string, userId: string, role: UserRole) {
  const supabase = createDatabaseClient()
  const { data, error } = await supabase
    .from('club_memberships')
    .update({ role })
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Audit logging
export async function logAuditEvent(event: {
  user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}) {
  const supabase = createDatabaseClient()
  const { error } = await supabase
    .from('audit_logs')
    .insert(event)
  
  return { error }
}

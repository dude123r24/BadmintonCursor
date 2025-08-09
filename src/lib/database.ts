import { createClient } from './supabase'
import { UserProfile, Club, ClubMembership } from '@/types/database'
import { UserRole } from '@/types/database'

// Type-safe Supabase client
export function createDatabaseClient() {
  return createClient()
}

// User profile utilities
export async function getUserProfile(userId: string) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error getting user profile:', err)
    return { data: null, error: err as Error }
  }
}

export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error creating user profile:', err)
    return { data: null, error: err as Error }
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error updating user profile:', err)
    return { data: null, error: err as Error }
  }
}

// Club utilities
export async function getClubs() {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (err) {
    console.error('Error getting clubs:', err)
    return { data: null, error: err as Error }
  }
}

export async function getClub(clubId: string) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error getting club:', err)
    return { data: null, error: err as Error }
  }
}

export async function createClub(club: Omit<Club, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('clubs')
      .insert(club)
      .select()
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error creating club:', err)
    return { data: null, error: err as Error }
  }
}

// Membership utilities
export async function getUserMemberships(userId: string) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('club_memberships')
      .select(`
        *,
        clubs (*)
      `)
      .eq('user_id', userId)
    
    return { data, error }
  } catch (err) {
    console.error('Error getting user memberships:', err)
    return { data: null, error: err as Error }
  }
}

export async function getClubMembers(clubId: string) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('club_memberships')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('club_id', clubId)
    
    return { data, error }
  } catch (err) {
    console.error('Error getting club members:', err)
    return { data: null, error: err as Error }
  }
}

export async function getUserRoleInClub(userId: string, clubId: string): Promise<UserRole | null> {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('club_memberships')
      .select('role')
      .eq('user_id', userId)
      .eq('club_id', clubId)
      .single()
    
    if (error || !data) return null
    return data.role
  } catch (err) {
    console.error('Error getting user role in club:', err)
    return null
  }
}

export async function addMemberToClub(membership: Omit<ClubMembership, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('club_memberships')
      .insert(membership)
      .select()
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error adding member to club:', err)
    return { data: null, error: err as Error }
  }
}

export async function updateMemberRole(clubId: string, userId: string, role: UserRole) {
  try {
    const supabase = createDatabaseClient()
    const { data, error } = await supabase
      .from('club_memberships')
      .update({ role })
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .select()
      .single()
    
    return { data, error }
  } catch (err) {
    console.error('Error updating member role:', err)
    return { data: null, error: err as Error }
  }
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
  try {
    const supabase = createDatabaseClient()
    const { error } = await supabase
      .from('audit_logs')
      .insert(event)
    
    return { error }
  } catch (err) {
    console.error('Error logging audit event:', err)
    return { error: err as Error }
  }
}

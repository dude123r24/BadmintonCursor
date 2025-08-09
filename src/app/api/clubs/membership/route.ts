import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { addMemberToClub } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { club_id, user_id, role, status } = body

    if (!club_id || !user_id || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Add member to club
    const { data, error } = await addMemberToClub({
      club_id,
      user_id,
      role,
      status: status || 'active',
      joined_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error adding member to club:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error('Error in membership API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

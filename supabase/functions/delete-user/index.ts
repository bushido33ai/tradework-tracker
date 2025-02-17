
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userId } = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log("Starting deletion process for user:", userId)

    // 0. First, delete the user from auth.users BEFORE cleaning up related data
    // This ensures the user is truly removed from auth system first
    const { error: authError } = await supabaseClient.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw authError
    }

    console.log("Successfully deleted user from auth system")

    // Now clean up all related data
    // 1. Delete from user_roles
    const { error: rolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
    
    if (rolesError) {
      console.error('Error deleting user roles:', rolesError)
      // Log but continue with other deletions
    }

    // 2. Delete job permissions
    const { error: permissionsError } = await supabaseClient
      .from('job_access_permissions')
      .delete()
      .eq('granted_by', userId)
    
    if (permissionsError) {
      console.error('Error deleting job permissions:', permissionsError)
      // Log but continue with other deletions
    }

    // 3. Delete access requests
    const { error: accessRequestError } = await supabaseClient
      .from('access_requests')
      .delete()
      .eq('user_id', userId)
    
    if (accessRequestError) {
      console.error('Error deleting access requests:', accessRequestError)
      // Log but continue with other deletions
    }

    // 4. Delete profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      // Log but continue
    }

    console.log("Successfully deleted user and all related data")

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

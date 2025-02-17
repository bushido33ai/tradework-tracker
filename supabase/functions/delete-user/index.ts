
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
    
    try {
      // 1. First delete all job-related data
      // Delete job invoices
      const { error: jobInvoicesError } = await supabaseClient
        .from('job_invoices')
        .delete()
        .eq('uploaded_by', userId)

      if (jobInvoicesError) {
        console.error('Error deleting job invoices:', jobInvoicesError)
      }

      // Delete job designs
      const { error: jobDesignsError } = await supabaseClient
        .from('job_designs')
        .delete()
        .eq('uploaded_by', userId)

      if (jobDesignsError) {
        console.error('Error deleting job designs:', jobDesignsError)
      }

      // Delete job notes
      const { error: jobNotesError } = await supabaseClient
        .from('job_notes')
        .delete()
        .eq('created_by', userId)

      if (jobNotesError) {
        console.error('Error deleting job notes:', jobNotesError)
      }

      // Delete job days worked
      const { error: daysWorkedError } = await supabaseClient
        .from('job_days_worked')
        .delete()
        .eq('created_by', userId)

      if (daysWorkedError) {
        console.error('Error deleting days worked:', daysWorkedError)
      }

      // Delete job misc costs
      const { error: miscCostsError } = await supabaseClient
        .from('job_misc_costs')
        .delete()
        .eq('created_by', userId)

      if (miscCostsError) {
        console.error('Error deleting misc costs:', miscCostsError)
      }

      // Delete enquiry designs
      const { error: enquiryDesignsError } = await supabaseClient
        .from('enquiry_designs')
        .delete()
        .eq('uploaded_by', userId)

      if (enquiryDesignsError) {
        console.error('Error deleting enquiry designs:', enquiryDesignsError)
      }

      // Delete enquiries
      const { error: enquiriesError } = await supabaseClient
        .from('enquiries')
        .delete()
        .eq('created_by', userId)

      if (enquiriesError) {
        console.error('Error deleting enquiries:', enquiriesError)
      }

      // Delete jobs
      const { error: jobsError } = await supabaseClient
        .from('jobs')
        .delete()
        .eq('created_by', userId)

      if (jobsError) {
        console.error('Error deleting jobs:', jobsError)
      }

      // 2. Delete from user_roles
      const { error: rolesError } = await supabaseClient
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
      
      if (rolesError) {
        console.error('Error deleting user roles:', rolesError)
      }

      // 3. Delete job permissions
      const { error: permissionsError } = await supabaseClient
        .from('job_access_permissions')
        .delete()
        .eq('granted_by', userId)
      
      if (permissionsError) {
        console.error('Error deleting job permissions:', permissionsError)
      }

      // 4. Delete access requests
      const { error: accessRequestError } = await supabaseClient
        .from('access_requests')
        .delete()
        .eq('user_id', userId)
      
      if (accessRequestError) {
        console.error('Error deleting access requests:', accessRequestError)
      }

      // 5. Delete profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (profileError) {
        console.error('Error deleting profile:', profileError)
      }

      // 6. Finally delete the auth user
      const { error: authError } = await supabaseClient.auth.admin.deleteUser(userId)
      
      if (authError) {
        console.error('Error deleting auth user:', authError)
        throw authError
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
      console.error('Database operation failed:', error)
      throw error
    }

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

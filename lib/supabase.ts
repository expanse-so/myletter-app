import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback_key_for_build_only'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Get a Supabase client with service role key for admin operations
 * This should only be used server-side in secure contexts
 */
export const getServiceSupabase = () => {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Get a typed database response
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          created_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          newsletter_id: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          newsletter_id: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          newsletter_id?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      newsletter_content: {
        Row: {
          id: string
          newsletter_id: string
          title: string
          content: string
          status: string
          sent_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          newsletter_id: string
          title: string
          content: string
          status?: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          newsletter_id?: string
          title?: string
          content?: string
          status?: string
          sent_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}
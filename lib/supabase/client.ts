import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// Browser client for Client Components
export function createBrowserClient() {
  return createClientComponentClient<Database>()
}

// Server client for Server Components and Server Actions
export function createServerClient() {
  return createServerComponentClient<Database>({
    cookies
  })
}

// Legacy client (for direct usage without auth helpers)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)




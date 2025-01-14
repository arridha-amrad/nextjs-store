import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from '@/config'
import { Database } from '../../../database.types'

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

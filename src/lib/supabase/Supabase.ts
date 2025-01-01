import { cookies } from 'next/headers'
import { createClient } from './server'

export class Supabase {
  public static async initServerClient() {
    const cookie = await cookies()
    const sb = createClient(cookie)
    return sb
  }
}

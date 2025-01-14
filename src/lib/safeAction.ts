import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import { cookies } from 'next/headers'
import { getAuthUserAndClient } from './utils'
import { redirect } from 'next/navigation'
import { SafeActionError } from './errors/SafeActionError'
import { createClient } from './supabase/server'

// base client
export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof SafeActionError) {
      return e.message
    }
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
}).use(async ({ next }) => {
  const cookie = await cookies()
  const supabase = createClient(cookie)
  return next({ ctx: { supabase } })
})

// client required auth
export const authActionClient = actionClient.use(async ({ next }) => {
  const cookie = await cookies()
  const { supabase, user } = await getAuthUserAndClient(cookie)
  if (!user) {
    return redirect('/login')
  }

  return next({ ctx: { user, supabase } })
})

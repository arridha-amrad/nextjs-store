'use server'

import { authActionClient } from '@/lib/safeAction'
import { redirect, RedirectType } from 'next/navigation'

export const logout = authActionClient.action(async ({ ctx: { supabase } }) => {
  await supabase.auth.signOut({ scope: 'local' })
  redirect('/login', RedirectType.replace)
})

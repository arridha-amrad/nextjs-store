'use server'

import { baseUrl } from '@/config'
import { Supabase } from '@/lib/supabase/Supabase'

export const loginWithGoogle = async () => {
  console.log('test')

  const supabase = await Supabase.initServerClient()

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })
}

'use server'

import { SafeActionError } from '@/lib/errors/SafeActionError'
import { actionClient } from '@/lib/safeAction'
import { redirect, RedirectType } from 'next/navigation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const login = actionClient
  .schema(
    zfd.formData({
      email: zfd.text(z.string().min(1)),
      password: zfd.text(z.string().min(1)),
    }),
  )
  .action(async ({ ctx: { supabase }, parsedInput: { email, password } }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      throw new SafeActionError(error.message)
    }
    redirect('/', RedirectType.replace)
  })

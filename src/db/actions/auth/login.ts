'use server'

import { LoginFormSchema } from '@/lib/definitions/auth'
import { Supabase } from '@/lib/supabase/Supabase'
import { redirect, RedirectType } from 'next/navigation'

export async function login(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = await Supabase.initServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect('/', RedirectType.replace)
}

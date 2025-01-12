'use server'

import { SignupFormSchema } from '@/lib/definitions/auth'
import { actionClient } from '@/lib/safeAction'
import { Supabase } from '@/lib/supabase/Supabase'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

const schema = zfd.formData({
  name: zfd.text(z.string().min(1).max(100).trim()),
  email: zfd.text(z.string().email().trim()),
  password: zfd.text(
    z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
  ),
})

export const registerUser = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    return {
      message: `An email has been sent to ${email}. Please follow the instructions to complete your registration`,
    }
  })

export async function signup(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const terms = formData.get('terms')

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (terms !== 'on') {
    return {
      error: 'You need to accept our terms and condition',
    }
  }

  const supabase = await Supabase.initServerClient()

  const { data: d } = await supabase
    .from('accounts')
    .select('id')
    .eq('email', email)

  if (d && d.length > 0) {
    return {
      error: `${email} has been registered`,
    }
  }

  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  if (user) {
    const { data: newAccount, error: errNewAcount } = await supabase
      .from('accounts')
      .insert({
        email,
        name,
        user_id: user?.id,
      })
      .select()
      .single()

    if (errNewAcount) {
      console.log({ errNewAcount })
    }

    if (newAccount) {
      await supabase
        .from('account_roles')
        .insert({ role_id: 2, account_id: newAccount.id })
    }
  }

  return {
    message: `An email has been sent to ${email}. Please follow the instructions to complete your registration`,
  }
}

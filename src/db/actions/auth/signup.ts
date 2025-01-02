'use server'

import { SignupFormSchema } from '@/lib/definitions/auth'
import { Supabase } from '@/lib/supabase/Supabase'

export async function signup(_: any, formData: FormData) {
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

  return {
    message: `An email has been sent to ${email}. Please follow the instructions to complete your registration`,
  }
}

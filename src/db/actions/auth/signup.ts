'use server'

import { SafeActionError } from '@/lib/errors/SafeActionError'
import { actionClient } from '@/lib/safeAction'
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
  terms: zfd
    .checkbox()
    .refine((val) => val, 'Please check our terms and conditions'),
})

export const signUp = actionClient
  .schema(schema)
  .action(
    async ({ parsedInput: { email, name, password }, ctx: { supabase } }) => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', email)

      if (error) {
        throw new SafeActionError(error.message)
      }

      if (data.length > 0) {
        throw new SafeActionError('Email has been registered')
      }

      const {
        error: errSignup,
        data: { user },
      } = await supabase.auth.signUp({
        email,
        password,
      })

      if (errSignup) {
        throw new SafeActionError(errSignup.message)
      }

      if (!user) {
        throw new SafeActionError('no user after signup')
      }

      const { error: errNewAccount } = await supabase.rpc(
        'create_account_with_role',
        {
          new_email: email,
          new_name: name,
          new_user_id: user.id,
        },
      )

      if (errNewAccount) {
        throw new SafeActionError(errNewAccount.message)
      }

      return {
        message: `An email has been sent to ${email}. Please follow the instructions to complete your registration`,
      }
    },
  )

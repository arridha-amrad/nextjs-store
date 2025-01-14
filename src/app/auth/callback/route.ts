import { createClient } from '@/lib/supabase/server'
import { Supabase } from '@/lib/supabase/Supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await Supabase.initServerClient()
    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (user && user.email) {
        const cookie = await cookies()
        const supabase = createClient(cookie)
        const { data } = await supabase
          .from('accounts')
          .select()
          .eq('email', user.email)
        if (data?.length === 0) {
          await supabase.rpc('create_account_with_role', {
            new_email: user.email,
            new_name: user.email.split('@')[0],
            new_user_id: user.id,
          })
        }
      }
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

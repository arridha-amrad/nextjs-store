import { setCookieToken } from '@/lib/cookie';
import { Supabase } from '@/lib/supabase/Supabase';
import { type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await Supabase.initServerClient();

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const { session } = data;
      if (session) {
        const { access_token } = session;
        setCookieToken(access_token);
      }
      redirect(next);
    }
  }

  redirect('/error');
}

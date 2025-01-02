'use server';

import { Supabase } from '@/lib/supabase/Supabase';

export const loginWithGoogle = async () => {
  console.log('test');

  const supabase = await Supabase.initServerClient();

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  });
};

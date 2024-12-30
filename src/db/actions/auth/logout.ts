'use server';

import { Supabase } from '@/lib/supabase/Supabase';
import { redirect } from 'next/navigation';

export const logout = async () => {
  const supabase = await Supabase.initServerClient();
  await supabase.auth.signOut({ scope: 'local' });

  redirect('/login');
};

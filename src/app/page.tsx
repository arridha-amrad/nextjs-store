import { logout } from '@/db/actions/auth/logout';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookie = await cookies();
  const supabase = createClient(cookie);
  const { data } = await supabase.auth.getUser();
  return (
    <main className="container mx-auto">
      <h1>{JSON.stringify(data.user?.id)}</h1>
      <Button onClick={logout}>Logout</Button>
    </main>
  );
}

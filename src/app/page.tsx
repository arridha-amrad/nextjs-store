import AppHeader from '@/components/AppHeader';
import Products from '@/components/Products';
import Cart from '@/components/Cart';
import { Supabase } from '@/lib/supabase/Supabase';

export default async function Page() {
  const sb = await Supabase.initServerClient();
  const { data } = await sb.auth.getUser();

  const { data: user } = await sb
    .from('users')
    .select()
    .eq('email', data.user?.email ?? '')
    .single();

  const { count } = await sb
    .from('carts')
    .select('*', { count: 'exact' })
    .eq('user_id', data.user?.id ?? '');

  return (
    <main className="pb-20">
      <AppHeader user={user}>
        <Cart total={count ?? 0} />
      </AppHeader>
      <Products />
    </main>
  );
}

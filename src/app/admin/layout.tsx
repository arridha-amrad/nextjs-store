import { AppSidebar } from '@/components/AppSidebar';
import BreadcrumbAdmin from '@/components/BreadcrumbAdmin';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Supabase } from '@/lib/supabase/Supabase';
import { unauthorized } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const sb = await Supabase.initServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user) {
    const { data: role, error: errRole } = await sb
      .from('user_role')
      .select()
      .eq('user_id', user.id)
      .single();
    if (errRole) {
      console.log(errRole);
    }
    if (role && role.role_id !== 1) {
      unauthorized();
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <BreadcrumbAdmin />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

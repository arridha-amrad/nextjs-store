import { AppSidebar } from '@/components/AppSidebar'
import BreadcrumbAdmin from '@/components/BreadcrumbAdmin'

import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getUser } from '@/db/queries/users'
import { cookies } from 'next/headers'
import { unauthorized } from 'next/navigation'
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = await cookies()
  const user = await getUser(cookie)
  if (!user || (user && user.role !== 'admin')) {
    return unauthorized()
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
        <div className="py-4 px-16">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

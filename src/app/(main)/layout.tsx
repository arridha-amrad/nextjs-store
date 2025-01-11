import AppHeader from '@/components/AppHeader'
import Cart from '@/components/Cart'
import { countCart } from '@/db/queries/carts'
import { getUser } from '@/db/queries/users'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'

async function Layout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  const cookie = await cookies()

  const [user, count] = await Promise.all([getUser(cookie), countCart(cookie)])

  return (
    <div className="pb-20">
      <AppHeader user={user}>
        <Cart total={count} />
      </AppHeader>
      <main className="container mx-auto">
        {children}
        {modal}
      </main>
    </div>
  )
}

export default Layout

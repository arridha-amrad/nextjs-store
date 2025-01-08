'use client'

import { AuthUser } from '@/lib/definitions/auth'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import DropDownUser from './dropdowns/User'
import InputSearchProduct from './InputSearchProduct'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

type Props = {
  user: AuthUser | null
  children: ReactNode
}

function AppHeader({ user, children }: Props) {
  const { ref, inView } = useInView()
  const router = useRouter()

  return (
    <>
      <header
        className={cn(
          `sticky z-10 bg-background/70 backdrop-blur top-0 left-0 right-0 transition-all ease-linear duration-200 container mx-auto flex justify-between gap-8 items-center`,
          inView ? 'py-10' : 'py-4',
        )}
      >
        <Link href="/">
          <h1
            className={cn(
              'scroll-m-20 font-extrabold tracking-tight ',
              inView ? 'text-5xl' : 'text-2xl',
            )}
          >
            Nextstore
          </h1>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost">Categories</Button>
          <InputSearchProduct />
          {children}
        </div>
        <Separator className="h-[25px]" orientation="vertical" />
        {user ? (
          <div className="relative">
            <DropDownUser user={user} />
          </div>
        ) : (
          <div className="flex items-center">
            <Button onClick={() => router.push('/login')} variant="link">
              Login
            </Button>
            <Button onClick={() => router.push('/register')} variant="link">
              Register
            </Button>
          </div>
        )}
      </header>
      <div ref={ref} />
    </>
  )
}

export default AppHeader

'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import User from './dropdowns/User'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { ReactNode } from 'react'
import { useRouter } from 'nextjs-toploader/app'

type User = {
  avatar: string | null
  name: string
}

type Props = {
  user: User | null
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
        <h1
          className={cn(
            'scroll-m-20 font-extrabold tracking-tight ',
            inView ? 'text-5xl' : 'text-2xl',
          )}
        >
          Nextstore
        </h1>
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost">Categories</Button>
          <div className="relative w-full">
            <div className="absolute top-0 left-0">
              <Button size="icon" variant="outline">
                <Search />
              </Button>
            </div>
            <Input className="w-full pl-14" placeholder="Search in nextstore" />
          </div>
          {children}
        </div>
        <Separator className="h-[25px]" orientation="vertical" />
        {user ? (
          <div className="relative">
            <User avatar={user?.avatar ?? ''} name={user?.name ?? ''} />
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

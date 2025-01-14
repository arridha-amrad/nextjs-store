'use client'

import GoogleLogin from '@/components/GoogleLogin'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/db/actions/auth/login'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { ChangeEventHandler, useState } from 'react'

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { execute, result, isPending } = useAction(login)

  const actionError = result.serverError
  const emailError = result.validationErrors?.email?._errors
  const passwordError = result.validationErrors?.password?._errors

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          {actionError ? (
            <p role="alert" className="text-sm text-destructive">
              {actionError}
            </p>
          ) : (
            <CardDescription>Access your account</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={execute}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-destructive text-xs">{emailError[0]}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formState.password}
                />
                {passwordError && (
                  <p className="text-destructive text-xs">{passwordError[0]}</p>
                )}
              </div>
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <Loader2 className="animate-spin" />}
                Login
              </Button>
              <GoogleLogin />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

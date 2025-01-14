'use client'

import GoogleLogin from '@/components/GoogleLogin'
import MyCheckBox from '@/components/MyCheckbox'
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
import { signUp } from '@/db/actions/auth/signUp'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { ChangeEventHandler, useState } from 'react'

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [formState, setFormState] = useState({
    email: '',
    name: '',
    password: '',
  })

  const { execute, isPending, result } = useAction(signUp, {
    onSuccess() {
      setFormState({
        email: '',
        name: '',
        password: '',
      })
    },
  })

  const emailError = result.validationErrors?.email?._errors
  const nameError = result.validationErrors?.name?._errors
  const passwordError = result.validationErrors?.password?._errors
  const termsError = result.validationErrors?.terms?._errors
  const actionError = result.serverError
  const actionResult = result.data?.message

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isAcceptTerms, setAcceptTerms] = useState(false)

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
          <CardTitle className="text-2xl">Register</CardTitle>
          {actionError ? (
            <p role="alert" className="text-sm text-destructive">
              {actionError}
            </p>
          ) : actionResult ? (
            <p role="alert" className="text-sm text-emerald-500">
              {actionResult}
            </p>
          ) : (
            <CardDescription>
              Let&apos;s start creating a new account
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={execute}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  value={formState.name}
                  onChange={handleChange}
                  id="name"
                  type="text"
                  name="name"
                />
                {nameError && (
                  <p className="text-destructive text-xs">{nameError[0]}</p>
                )}
              </div>
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
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    // value={formState.password}
                    value="freePalestine99!"
                    className="pr-12"
                  />
                  <Button
                    className="absolute top-0 right-0"
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => setIsShowPassword((val) => !val)}
                  >
                    {isShowPassword ? <EyeIcon /> : <EyeOff />}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-destructive text-xs">{passwordError[0]}</p>
                )}
              </div>
              <MyCheckBox
                id="terms"
                name="terms"
                checked={isAcceptTerms}
                label="Accept terms and conditions"
                onCheckedChange={(e: boolean) => setAcceptTerms(e)}
              />
              {termsError && (
                <p className="text-destructive text-xs">{termsError[0]}</p>
              )}
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <Loader2 className="animate-spin" />}
                Register
              </Button>
              <GoogleLogin />
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline pl-1 underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

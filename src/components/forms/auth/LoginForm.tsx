'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEventHandler, useActionState, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/db/actions/auth/login';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [state, action, pending] = useActionState(login, undefined);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const loginWithGoogle = async () => {
    const sb = createClient();
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          {state?.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : (
            <CardDescription>Access your account</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
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
                {state?.errors?.email && (
                  <p className="text-destructive text-xs">
                    {state.errors.email[0]}
                  </p>
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
                {state?.errors?.password && (
                  <p className="text-destructive text-xs">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              <Button disabled={pending} type="submit" className="w-full">
                {pending && <Loader2 className="animate-spin" />}
                Login
              </Button>
              <Button
                type="button"
                onClick={() => loginWithGoogle()}
                variant="outline"
                className="w-full"
              >
                Continue with Google
              </Button>
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
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../actions/signup";
import { ChangeEventHandler, useActionState, useEffect, useState } from "react";
import MyAlert from "@/components/MyAlert";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import MyCheckBox from "./MyCheckbox";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, pending] = useActionState(signup, undefined);

  const [formState, setFormState] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isAcceptTerms, setAccepTerms] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (state?.message) {
      setFormState({
        ...formState,
        email: "",
        name: "",
        password: "",
      });
    }
  }, [state?.message]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          {state?.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : state?.message ? (
            <p role="alert" className="text-sm text-emerald-500">
              {state.message}
            </p>
          ) : (
            <CardDescription>
              Let's start creating a new account
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
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
                {state?.errors?.name && (
                  <p className="text-destructive text-xs">
                    {state.errors.name[0]}
                  </p>
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
                {state?.errors?.email && (
                  <p className="text-destructive text-xs">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formState.password}
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
                {state?.errors?.password && (
                  <p className="text-destructive text-xs">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              <MyCheckBox
                isChecked={isAcceptTerms}
                label="Accept terms and conditions"
                setCheck={setAccepTerms}
              />
              <Button disabled={pending} type="submit" className="w-full">
                {pending && <Loader2 className="animate-spin" />}
                Register
              </Button>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline pl-1 underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

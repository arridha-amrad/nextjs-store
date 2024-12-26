"use server";

import { LoginFormSchema } from "@/lib/definitions/auth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function login(_: unknown, formData: FormData) {
  const cookie = await cookies();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = LoginFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient(cookie);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/", RedirectType.replace);
}

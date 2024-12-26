"use server";

import { setCookieToken } from "@/lib/cookie";
import { LoginFormSchema } from "@/lib/definitions/auth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function login(_: any, formData: FormData) {
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

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  const { session } = data;

  if (session) {
    setCookieToken(session.access_token);
  } else {
    return {
      error: "something went wrong",
    };
  }

  redirect("/", RedirectType.replace);
}

"use server";

import { setCookieToken } from "@/lib/cookie";
import { LoginFormSchema } from "@/lib/definition";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";

export async function login(_: any, formData: FormData) {
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

  const supabase = await createClient();

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

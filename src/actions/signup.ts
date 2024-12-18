"use server";

import { createClient } from "@/lib/supabase/server";
import { SignupFormSchema } from "@/lib/definition";

export async function signup(_: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const terms = formData.get("terms");

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (terms !== "on") {
    return {
      error: "You need to accept our terms and condition",
    };
  }

  const supabase = await createClient();

  const { data: d } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);

  if (d && d.length > 0) {
    return {
      error: `${email} has been registered`,
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  await supabase.from("users").insert({
    email,
    name,
    terms: true,
  });

  return {
    message: `An email has been sent to ${email}. Please follow the instructions to complete your registration`,
  };
}

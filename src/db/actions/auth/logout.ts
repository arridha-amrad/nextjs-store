"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const cookie = await cookies();
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  cookie.delete("sb:token");
  redirect("/login");
};

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../database.types";
import { supabaseKey, supabaseUrl } from "@/config";

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

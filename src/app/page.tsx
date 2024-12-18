import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    <main className="container mx-auto">
      <h1>{JSON.stringify(data)}</h1>
      <Button onClick={logout}>Logout</Button>
    </main>
  );
}

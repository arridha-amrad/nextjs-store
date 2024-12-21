import { createClient } from "@/lib/supabase/server";
import MyAvatar from "@/components/MyAvatar";
import { cookies } from "next/headers";

export default async function Page() {
  const cookie = await cookies();
  const sb = createClient(cookie);
  const user = await sb.auth.getUser();
  const authUser = await sb
    .from("users")
    .select("*")
    .eq("email", user.data.user?.email ?? "");

  if (!authUser.data) return null;
  const data = authUser.data[0];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video flex flex-col gap-1 items-center justify-center rounded-lg bg-muted/50">
          <MyAvatar src={data.avatar ?? ""} />
          <h1 className="font-medium text-lg block">{authUser.data[0].name}</h1>
          <p className="text-sm">{authUser.data[0].email}</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

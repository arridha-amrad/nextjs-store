import MyAvatar from '@/components/MyAvatar'
import { getUser } from '@/db/queries/users'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const user = await getUser(cookie)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video flex flex-col gap-1 items-center justify-center rounded-lg bg-muted/50">
          <MyAvatar src={user?.avatar ?? ''} />
          <h1 className="font-medium text-lg block">{user?.name}</h1>
          <p className="text-sm">{user?.email}</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}

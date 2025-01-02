import { Supabase } from '@/lib/supabase/Supabase'

async function Page() {
  const supabase = await Supabase.initServerClient()
  const { data } = await supabase.from('accounts').select()
  console.log(data)

  return (
    <div>
      <h1>Anon Page</h1>
    </div>
  )
}

export default Page

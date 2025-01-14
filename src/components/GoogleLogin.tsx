import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { baseUrl } from '@/config'

export default function GoogleLogin() {
  const googleOauth = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    })
  }
  return (
    <Button
      onClick={googleOauth}
      type="button"
      variant="outline"
      className="w-full"
    >
      Continue with Google
    </Button>
  )
}

import { CACHE_KEY_USER } from '@/cacheKey'
import { getAuthUserAndClient } from '@/lib/utils'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getUserByEmailFromCache = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const { supabase, user } = await getAuthUserAndClient(cookie)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user?.email ?? '')
      .single()
    if (error) {
      console.log(error)
    }
    return data
  },
  [CACHE_KEY_USER],
  { tags: [CACHE_KEY_USER] },
)

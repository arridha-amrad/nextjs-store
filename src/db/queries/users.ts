import { CACHE_KEY_USER } from '@/cacheKey'
import { getAuthUserAndClient } from '@/lib/utils'
import { unstable_cache } from 'next/cache'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getUser = unstable_cache(
  async (cookie: ReadonlyRequestCookies) => {
    const { supabase, user } = await getAuthUserAndClient(cookie)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user?.id ?? '')
      .single()

    if (!data) return null

    const { data: ac, error: errac } = await supabase
      .from('account_roles')
      .select(
        `*,
        roles(
          title
        )
        `,
      )
      .eq('account_id', data.id ?? 0)
      .single()

    if (error || errac) {
      console.log({ error })
      console.log({ errac })
    }

    return {
      ...data,
      role: ac?.roles.title,
    }
  },
  [CACHE_KEY_USER],
  { tags: [CACHE_KEY_USER] },
)

import { getAuthUserAndClient } from '@/lib/utils'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { redirect } from 'next/navigation'

// const getOrders = (orderId:string, cookie: ReadonlyRequestCookies) => {
//   const cookie =
//   const {data, error} = await
// }

export const getTransactionsFromCache = async (
  cookie: ReadonlyRequestCookies,
) => {
  const { supabase, user } = await getAuthUserAndClient(cookie)
  if (!user) {
    return redirect('/login')
  }
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.log(error)
  }

  if (!data) return []

  const allOrders = []
  for (const d of data) {
    const { data: result, error: err } = await supabase
      .from('orders')
      .select(
        `*,
        products(
        name,price,
        product_photo (
          url
        )
        )
      `,
      )
      .eq('order_id', d.id)
      .single()
    if (err) {
      console.log(err)
    }
    if (result) {
      allOrders.push(result)
    }
  }

  return {
    ...data,
    allOrders,
  }
}

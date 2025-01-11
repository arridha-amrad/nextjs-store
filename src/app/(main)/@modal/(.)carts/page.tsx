import Cart from '@/components/ShopCart'
import CartPayButton from '@/components/ShopCart/CartPayButton'
import { ContextCartProvider } from '@/components/ShopCart/Context'
import { getCart, getCartsAmount } from '@/db/queries/carts'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookie = await cookies()
  const [result, totalPrice] = await Promise.all([
    getCart(cookie),
    getCartsAmount(cookie),
  ])
  return (
    <ContextCartProvider>
      <Cart data={result}>
        <CartPayButton totalPrice={totalPrice} />
      </Cart>
    </ContextCartProvider>
  )
}

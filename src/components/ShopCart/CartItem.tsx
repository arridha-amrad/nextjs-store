'use client'

import { supabaseStorageBaseUrl } from '@/config'
import { destroy } from '@/db/actions/carts'
import { cn, rupiahFormatter } from '@/lib/utils'
import { Loader, Trash } from 'lucide-react'
import Image from 'next/image'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import CartItemCheckbox from './CartItemCheckbox'
import CartItemTotalItem from './CartItemTotalItem'
import { useShopCart } from './Context'

type Props = {
  id: number
  productName: string
  photo: string
  productId: string
  totalItem: number
  price: number
  isSelect: boolean
}

export default function CartItem({
  photo,
  price,
  productName,
  id,
  totalItem,
  isSelect,
}: Props) {
  const [pending, startTransition] = useTransition()

  const deleteItem = () => {
    startTransition(async () => {
      await destroy({ cartId: id })
    })
  }

  const { isLoading } = useShopCart()

  return (
    <div
      className={cn('space-y-3 pr-4', isSelect ? 'opacity-100' : 'opacity-50')}
    >
      <div className="flex items-center gap-2">
        <CartItemCheckbox id={id} isSelect={isSelect} />
        <h1 className="text-sm font-semibold line-clamp-1">{productName}</h1>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Image
          alt="product_photo"
          src={`${supabaseStorageBaseUrl}/${photo}`}
          className="object-cover"
          width={150}
          height={150}
        />
        <div className="w-full space-y-2 ">
          <CartItemTotalItem id={id} totalItem={totalItem} />
          <div className="space-y-2 relative">
            <div className="py-2">
              <h1>{rupiahFormatter.format(price * totalItem)}</h1>
            </div>
            {isLoading && (
              <div className=" absolute bottom-2 right-5">
                <Loader className="animate-spin w-4" />
              </div>
            )}
          </div>
          <Button
            disabled={pending || isLoading}
            onClick={deleteItem}
            size="sm"
            variant="destructive"
            title="delete"
          >
            {pending && <Loader className="animate-spin" />}
            Delete
            <Trash className="w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

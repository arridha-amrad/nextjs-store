'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { TCarts } from '@/db/queries/carts'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import CartItem from './CartItem'

type Props = {
  data: TCarts
  children: ReactNode
}

export default function Cart({ data, children }: Props) {
  const [open, setOpen] = useState(true)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/carts' && !open) {
      router.back()
    }
    // eslint-disable-next-line
  }, [open, pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle asChild>
            <div className="flex items-center gap-4 pb-4">
              <h1 className="block font-extrabold">Your Cart</h1>
            </div>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription asChild>
          <div className="py-4 flex-1 flex flex-col gap-14 overflow-auto">
            {data.data?.map((v) => (
              <CartItem
                id={v.id}
                photo={v.products.product_photos[0].url}
                price={v.products.price}
                productId={v.product_id}
                productName={v.products.name}
                totalItem={v.total}
                isSelect={v.is_select}
                key={v.id}
              />
            ))}
          </div>
        </SheetDescription>
        <SheetFooter>{children}</SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

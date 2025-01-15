'use client'

import { createTransaction } from '@/db/actions/transactions'
import { useToast } from '@/hooks/use-toast'
import { Loader } from 'lucide-react'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { useShopCart } from './Context'
import { rupiahFormatter } from '@/lib/utils'

type Props = {
  totalPrice: number
}

function CartPayButton({ totalPrice }: Props) {
  const { isLoading } = useShopCart()
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  const placeOrder = () => {
    startTransition(async () => {
      const result = await createTransaction({})
      if (result?.data) {
        toast({
          description: result.data,
        })
      }
      if (result?.serverError) {
        toast({
          description: result.serverError,
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Button
      onClick={placeOrder}
      disabled={isLoading || pending || totalPrice === 0}
      className="w-full"
    >
      {(isLoading || pending) && <Loader className="animate-spin" />}
      Pay
      <span className="">
        {totalPrice > 0 && `${rupiahFormatter.format(totalPrice)}`}
      </span>
    </Button>
  )
}

export default CartPayButton

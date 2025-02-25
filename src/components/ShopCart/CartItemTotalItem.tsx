import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useDebounce } from 'use-debounce'
import { updateCart } from '@/db/actions/carts'
import { useShopCart } from './Context'

type Props = {
  id: number
  totalItem: number
}

function CartItemTotalItem({ totalItem, id }: Props) {
  const [total, setTotal] = useState(totalItem)
  const [value, { isPending }] = useDebounce(total, 1000)
  const pending = isPending()

  const { setLoading } = useShopCart()

  useEffect(() => {
    updateCart({ id, total: value }).finally(() => {
      setLoading(false)
    })
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    if (pending) {
      setLoading(true)
    }
  }, [pending, setLoading])

  return (
    <div className="space-y-2">
      <Label htmlFor="total">Total</Label>
      <Input
        onChange={(e) =>
          isNaN(parseInt(e.target.value))
            ? 0
            : setTotal(parseInt(e.target.value))
        }
        id="total"
        type="number"
        step={1}
        min={1}
        value={total}
      />
    </div>
  )
}

export default CartItemTotalItem

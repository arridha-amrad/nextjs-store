import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useDebounce } from 'use-debounce'
import { update } from '@/db/actions/carts'
import { useShopCart } from './Context'

type Props = {
  id: number
  totalItem: number
}

function CartItemTotalItem({ totalItem, id }: Props) {
  const [total, setTotal] = useState(totalItem)
  const [value, { isPending }] = useDebounce(total, 1000)

  const { setLoading } = useShopCart()

  useEffect(() => {
    update(id, { total: value }).then(() => {
      setLoading(false)
    })
  }, [value])

  useEffect(() => {
    if (isPending()) {
      setLoading(true)
    }
  }, [isPending()])

  return (
    <div className="space-y-2">
      <Label htmlFor="total">Total</Label>
      <Input
        onChange={(e) => setTotal(parseInt(e.target.value))}
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

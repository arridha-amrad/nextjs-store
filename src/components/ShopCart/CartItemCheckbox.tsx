'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { useDebounce } from 'use-debounce'
import { update } from '@/db/actions/carts'
import { useShopCart } from './Context'

type Props = {
  isSelect: boolean
  id: number
}

function CartItemCheckbox({ isSelect, id }: Props) {
  const [isChecked, setChecked] = useState(isSelect)
  const [value, { isPending }] = useDebounce(isChecked, 500)
  const pending = isPending()

  const { setLoading } = useShopCart()

  useEffect(() => {
    update(id, { is_select: value }).then(() => {
      setLoading(false)
    })
  }, [value, id, setLoading])

  useEffect(() => {
    if (pending) {
      setLoading(true)
    }
  }, [pending, setLoading])

  return (
    <Checkbox
      checked={isChecked}
      onCheckedChange={(value) => setChecked(value as boolean)}
    />
  )
}

export default CartItemCheckbox

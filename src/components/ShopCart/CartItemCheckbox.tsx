'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { useDebounce } from 'use-debounce';
import { updateCartItem } from '@/db/actions/checkout';
import { useShopCart } from './Context';

type Props = {
  isSelect: boolean;
  id: number;
};

function CartItemCheckbox({ isSelect, id }: Props) {
  const [isChecked, setChecked] = useState(isSelect);
  const [value, { isPending }] = useDebounce(isChecked, 500);

  const { setLoading } = useShopCart();

  useEffect(() => {
    updateCartItem(id, { is_select: value }).then(() => {
      setLoading(false);
    });
  }, [value]);

  useEffect(() => {
    if (isPending()) {
      setLoading(true);
    }
  }, [isPending()]);

  return (
    <Checkbox
      checked={isChecked}
      onCheckedChange={(value) => setChecked(value as boolean)}
    />
  );
}

export default CartItemCheckbox;

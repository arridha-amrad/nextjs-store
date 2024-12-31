'use client';

import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { useShopCart } from './Context';
import { createOrder } from '@/db/actions/checkout';
import { useTransition } from 'react';

type Props = {
  totalPrice: number;
};

function CartPayButton({ totalPrice }: Props) {
  const { isLoading } = useShopCart();
  const [pending, startTransition] = useTransition();

  const placeOrder = () => {
    startTransition(async () => {
      await createOrder();
    });
  };

  return (
    <Button
      onClick={placeOrder}
      disabled={isLoading || pending || totalPrice === 0}
      className="w-full"
    >
      {(isLoading || pending) && <Loader className="animate-spin" />}
      Pay
      <span className="pl-1">
        {totalPrice > 0 && `$${totalPrice.toFixed(2)}`}
      </span>
    </Button>
  );
}

export default CartPayButton;

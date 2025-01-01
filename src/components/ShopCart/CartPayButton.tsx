'use client';

import { createOrder } from '@/db/actions/checkout';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import { useShopCart } from './Context';

type Props = {
  totalPrice: number;
};

function CartPayButton({ totalPrice }: Props) {
  const { isLoading } = useShopCart();
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const placeOrder = () => {
    startTransition(async () => {
      const result = await createOrder();
      toast({
        description: result,
      });
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

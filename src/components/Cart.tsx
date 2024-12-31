'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'nextjs-toploader/app';

type Props = {
  total: number;
};

export default function Cart({ total }: Props) {
  const router = useRouter();
  return (
    <div className="relative">
      <Button
        onClick={() => router.push('/checkout')}
        className="aspect-square"
        variant="secondary"
        size="icon"
      >
        <ShoppingCart />
      </Button>
      <div className="absolute rounded-full -bottom-2 -right-2 w-6 flex items-center justify-center aspect-square bg-destructive">
        <p className="text-sm text-white">{total}</p>
      </div>
    </div>
  );
}

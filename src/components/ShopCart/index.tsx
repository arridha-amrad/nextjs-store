'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TCarts } from '@/db/queries/carts';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useShopCart } from './Context';

type Props = {
  data: TCarts;
};

export default function Cart({ data }: Props) {
  const [open, setOpen] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const { setProducts, products, updatedProductTotal } = useShopCart();

  useEffect(() => {
    setProducts(data);
  }, [data.data?.length]);

  const totalPayment = useCallback(() => {
    let total = 0;
    if (!products?.data) return total;
    for (const p of products.data) {
      const currTotal = p.total * p.products.price;
      total += currTotal;
    }
    return total.toFixed(2);
  }, [products?.data]);

  useEffect(() => {
    if (pathname === '/checkout' && !open) {
      router.back();
    }
  }, [open, pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle asChild>
            <div className="flex items-center gap-4 pb-4">
              <h1 className="block text-2xl font-extrabold">Your Cart</h1>
              <ShoppingCart />
            </div>
          </SheetTitle>
        </SheetHeader>
        <SheetDescription asChild>
          <div className="py-4 flex-1 space-y-8 overflow-auto">
            {products?.data?.map((v, i) => (
              <div key={v.id} className="space-y-3 pr-4">
                <h1 className="text-sm font-semibold line-clamp-1">
                  {v.products.name}
                </h1>
                <div className="flex items-center justify-between gap-4">
                  <Image
                    alt="product_photo"
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${v.products.product_photo[0].url}`}
                    className="object-cover"
                    width={150}
                    height={150}
                  />
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="total">Total</Label>
                      <Input
                        onChange={(e) =>
                          updatedProductTotal(
                            v.product_id,
                            parseInt(e.target.value),
                          )
                        }
                        id="total"
                        type="number"
                        step={1}
                        min={1}
                        defaultValue={v.total}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        readOnly
                        value={v.products.price * v.total}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SheetDescription>
        <SheetFooter>
          <Button className="w-full">Pay ${totalPayment()}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

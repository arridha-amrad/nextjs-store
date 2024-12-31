'use client';

import { addToCart as atc } from '@/db/actions/checkout/create';
import { useToast } from '@/hooks/use-toast';
import { Loader, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Database } from '../../../database.types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useTransition } from 'react';

const IMAGE_BASE_URL =
  'https://fzsbsdqssixryyzeanoc.supabase.co/storage/v1/object/public/products';

type Product = Database['public']['Tables']['products']['Row'];
type ProductPhoto = Database['public']['Tables']['product_photo']['Row'];

type Props = {
  product: Product & {
    product_photo: ProductPhoto[];
  };
};

function ProductItem({ product }: Props) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const addToCart = () => {
    startTransition(async () => {
      const result = await atc(product.id);
      if (result) {
        toast({
          description: `${product.name} added to cart`,
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to add product to your cart',
        });
      }
    });
  };

  return (
    <Card
      className="overflow-hidden group flex flex-col relative"
      key={product.id}
    >
      <div className="overflow-hidden">
        <Image
          width={500}
          height={500}
          alt="product-photo"
          src={`${IMAGE_BASE_URL}/${product.product_photo[0].url}`}
        />
      </div>
      <div className="px-4 py-2 flex-1">
        <h1 className="line-clamp-2 text-sm text-muted-foreground">
          {product.name}
        </h1>
        <h2 className="text-xl font-bold leading-loose">$ {product.price}</h2>
      </div>
      <div className="bottom-0 absolute group-hover:opacity-0 opacity-100 left-0 py-2 px-4">
        <p className="text-sm text-muted-foreground">5 Sold</p>
      </div>
      <Button
        disabled={pending}
        className="w-full opacity-0 group-hover:opacity-100 ease-linear duration-300 transition-opacity relative select-none cursor-pointer"
        size="sm"
        onClick={addToCart}
      >
        {pending ? <Loader className="animate-spin" /> : <ShoppingCart />}
        Add To Cart
      </Button>
    </Card>
  );
}

export default ProductItem;

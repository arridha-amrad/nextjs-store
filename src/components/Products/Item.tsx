'use client'

import { supabaseStorageBaseUrl } from '@/config'
import { ProductsOnSales } from '@/db/queries/product'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Loader, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { create } from '@/db/actions/carts'

type Props = {
  product: ProductsOnSales
}

function ProductItem({ product }: Props) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const addToCart = () => {
    startTransition(async () => {
      const result = await create(product.id)
      if (result) {
        toast({
          description: `${product.name} added to cart`,
        })
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to add product to your cart',
        })
      }
    })
  }

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
          src={`${supabaseStorageBaseUrl}/${product.product_photos[0].url}`}
        />
      </div>
      <div className="px-4 py-2 flex-1">
        <h1 className="line-clamp-2 text-sm text-muted-foreground">
          {product.name}
        </h1>
        <h2 className="text-xl font-bold leading-loose">$ {product.price}</h2>
      </div>
      <div className="bottom-0 absolute group-hover:opacity-0 opacity-100 left-0 py-2 px-4">
        <p className="text-sm font-semibold text-muted-foreground">
          <span className="pr-1">Stock</span>
          <span className={cn(product.stock <= 5 ? 'text-destructive' : '')}>
            {product.stock}
          </span>
        </p>
      </div>
      <Button
        disabled={pending}
        className={cn(
          'w-full group-hover:opacity-100 ease-linear duration-300 transition-opacity relative select-none cursor-pointer',
          pending ? 'opacity-100' : 'opacity-0',
        )}
        size="sm"
        onClick={addToCart}
      >
        {pending ? <Loader className="animate-spin" /> : <ShoppingCart />}
        Add To Cart
      </Button>
    </Card>
  )
}

export default ProductItem

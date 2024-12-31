'use client';

import { TCarts } from '@/db/queries/carts';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type TContext = {
  products: TCarts | null;
  setProducts: Dispatch<SetStateAction<TCarts | null>>;
  updatedProductTotal: (pId: string, newTotal: number) => void;
};

const Context = createContext<TContext>({
  products: null,
  setProducts: () => {},
  updatedProductTotal: (pId: string, newTotal: number) => {},
});

export const ContextCartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<TCarts | null>(null);

  const updatedProductTotal = (productId: string, newTotal: number) => {
    if (!products || !products.data) return;
    const copyProducts = products;
    const product = copyProducts.data.find((v) => v.product_id === productId);
    if (product) {
      product.total = newTotal;
      setProducts({
        ...products,
        ...copyProducts,
      });
    }
    // const copyProducts = products;
    // const product = copyProducts.data.find((v) => v.product_id === productId);

    // console.log({ product });

    // if (product) {
    //   product.total = newTotal;
    //   product.products.price *= newTotal;

    //   console.log({
    //     total: product.total,
    //     price: product.products.price,
    //   });

    //   setProducts({
    //     ...products,
    //     ...copyProducts,
    //   });
    // }
  };

  return (
    <Context value={{ products, setProducts, updatedProductTotal }}>
      {children}
    </Context>
  );
};

export const useShopCart = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('Component must be wrapped inside ContextCardProvider');
  }
  return ctx;
};

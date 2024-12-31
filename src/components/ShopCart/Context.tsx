'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type TContext = {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<TContext>({
  isLoading: false,
  setLoading: () => {},
});

export const ContextCartProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return <Context value={{ isLoading, setLoading }}>{children}</Context>;
};

export const useShopCart = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('Component must be wrapped inside ContextCardProvider');
  }
  return ctx;
};

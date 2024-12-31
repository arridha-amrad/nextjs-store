'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SheetDemo() {
  const [open, setOpen] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/checkout' && !open) {
      router.back();
    }
  }, [open, pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

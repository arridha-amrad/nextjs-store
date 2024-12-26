import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TableProducts } from "@/features";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="py-4 px-16">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">All Products</h1>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Button asChild>
          <Link href="/admin/products/create">
            <Plus />
            New
          </Link>
        </Button>
      </div>
      <div className="py-10">
        <TableProducts />
      </div>
    </main>
  );
}

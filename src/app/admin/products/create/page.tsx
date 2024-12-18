import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSignIcon } from "lucide-react";

export default function Page() {
  return (
    <main className="py-4 px-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Add Product</h1>
      </div>
      <div className="">
        <form action="" className="grid grid-cols-2 gap-y-5 gap-x-10">
          <div className="space-y-3 col-span-2">
            <Label htmlFor="email">Name</Label>
            <Input id="email" type="email" name="email" />
          </div>
          <div className="space-y-3 col-span-2">
            <Label htmlFor="category">Category</Label>
            <Input
              placeholder="motherboard, pc, computer"
              id="category"
              type="category"
              name="category"
            />
          </div>

          <div className="space-y-3 relative">
            <Label htmlFor="price">Price</Label>
            <Input className="pl-14" id="price" type="number" name="price" />
            <Button
              className="top-6 left-0 absolute"
              variant="outline"
              size="icon"
            >
              <DollarSignIcon />
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" name="stock" />
          </div>
          <div className="space-y-3 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              placeholder="Type your message here."
              id="description"
            />
          </div>
          <div className="col-span-2">
            <div className="w-fit max-w-lg space-y-3">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                name="photo"
                multiple
                accept="image/*"
              />
            </div>
          </div>
          <Button className="self-end max-w-xs mt-8">Save</Button>
        </form>
      </div>
    </main>
  );
}

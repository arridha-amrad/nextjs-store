"use client";

import MyTooltip from "@/components/MyTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DollarSignIcon, Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useRef, useState } from "react";

import AlertDialogDeletePhoto from "./AlertDialogDeletePhoto";
import { TEditProduct } from "./definition";
import { editProductAction } from "./action";

type Props = {
  props: TEditProduct;
};

export default function FormEditProduct({ props }: Props) {
  const { categories, description, name, photos, price, stock, id } = props;

  const { toast } = useToast();
  const [error, setError] = useState("");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [state, action, isPending] = useActionState(
    editProductAction,
    undefined
  );

  const IMAGE_BASE_URL =
    "https://fzsbsdqssixryyzeanoc.supabase.co/storage/v1/object/public/products";

  return (
    <fieldset disabled={isPending}>
      <form action={action} className="grid grid-cols-2 gap-y-5 gap-x-10">
        <input type="text" hidden name="userId" defaultValue={id} />
        <div className="space-y-3 col-span-2">
          <Label htmlFor="productName">Product's Name</Label>
          <Input id="productName" type="text" name="name" defaultValue={name} />
          {state?.errors?.name && (
            <p className="text-destructive text-xs">{state?.errors?.name[0]}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <Label htmlFor="categories">Category</Label>
          <Input
            placeholder="motherboard, pc, computer"
            id="categories"
            type="text"
            name="categories"
            defaultValue={categories}
          />
          {state?.errors?.categories ? (
            <p className="text-destructive text-xs">
              {state?.errors.categories[0]}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Please use comma as separator
            </p>
          )}
        </div>

        <div className="space-y-3 relative">
          <Label htmlFor="price">Price</Label>
          <Input
            className="pl-10"
            id="price"
            type="number"
            step={0.01}
            name="price"
            defaultValue={price}
          />
          <Button
            className="top-6 left-0 absolute"
            variant="outline"
            size="icon"
            disabled
          >
            <DollarSignIcon />
          </Button>
          {state?.errors?.price && (
            <p className="text-destructive text-xs">{state?.errors.price[0]}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            step={1}
            name="stock"
            defaultValue={stock}
          />
          {state?.errors?.stock && (
            <p className="text-destructive text-xs">{state?.errors.stock[0]}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Type your message here."
            id="description"
            name="description"
            defaultValue={description}
          />
          {state?.errors?.description && (
            <p className="text-destructive text-xs">
              {state?.errors.description[0]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 col-span-2">
          {photos.map((v, i) => (
            <div
              key={i}
              className="rounded-lg group relative cursor-pointer flex items-center justify-center aspect-square max-w-[200px]"
            >
              <div className="absolute inset-0  group-hover:bg-black/65 transition-all duration-200 ease-linear" />
              <Image
                className="w-full h-auto object-fill object-center"
                width={500}
                height={500}
                src={`${IMAGE_BASE_URL}/${v}`}
                alt="product_photo"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 ease-linear transition-opacity">
                <AlertDialogDeletePhoto />
              </div>
            </div>
          ))}

          <MyTooltip content="Add More Photo">
            <div className="rounded-lg cursor-pointer border border-slate-700 flex items-center justify-center w-24 aspect-square">
              <input type="file" hidden />
              <PlusIcon className="text-slate-700" />
            </div>
          </MyTooltip>
        </div>
        <Button type="submit" className="self-end max-w-xs mt-8">
          {isPending && <Loader2 className="animate-spin" />}
          Save
        </Button>
      </form>
    </fieldset>
  );
}

"use client";

import SelectCategories from "@/components/SelectCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/db/actions/product/create";

import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { ChangeEventHandler, useActionState, useRef, useState } from "react";

export default function FormCreateProduct() {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const [state, action, pending] = useActionState(createProduct, undefined);

  const { toast } = useToast();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { description, name, price, stock } = formState;

  return (
    <form action={action} className="grid grid-cols-2 gap-y-5 gap-x-10">
      <div className="space-y-3 col-span-2">
        <Label htmlFor="productName">Product's Name</Label>
        <Input
          id="productName"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
        {state?.errors?.name && (
          <p className="text-destructive text-xs">{state?.errors.name[0]}</p>
        )}
      </div>
      <div className="col-span-2 space-y-3">
        <SelectCategories />
        {state?.errors?.categories && (
          <p className="text-destructive text-xs">
            {state?.errors.categories[0]}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step={0.01}
          name="price"
          value={price}
          onChange={handleChange}
        />
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
          value={stock}
          onChange={handleChange}
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
          value={description}
          onChange={(e) => {
            setFormState({
              ...formState,
              description: e.target.value,
            });
          }}
        />
        {state?.errors?.description && (
          <p className="text-destructive text-xs">
            {state?.errors.description[0]}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <div className="w-fit max-w-lg space-y-3">
          <Label htmlFor="photos">Product's Photo</Label>
          <Input
            ref={inputFileRef}
            id="photos"
            type="file"
            name="photos"
            multiple
            accept="image/*"
          />
          {state?.errorPhotos && (
            <p className="text-destructive text-xs">{state?.errorPhotos}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="self-end max-w-xs mt-8">
        {pending && <Loader className="animate-spin" />}
        Save
      </Button>
    </form>
  );
}

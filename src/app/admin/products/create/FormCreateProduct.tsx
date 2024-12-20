"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSignIcon, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createProductSchema, TCreateProduct } from "./definition";
import { submitCreateProductForm } from "./submitFn";

export default function FormCreateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TCreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      stock: 0,
      price: 0,
    },
  });

  const { toast } = useToast();
  const [error, setError] = useState("");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const files = inputFileRef.current?.files;
      if (!files || files.length === 0) {
        setError("Please insert the product's photos");
        return;
      }
      const message = await submitCreateProductForm(data, files);
      toast({
        description: message,
      });
      reset();
      inputFileRef.current!.value = "";
    } catch (err: any) {
      console.log(err);
      toast({
        description: err.message,
        variant: "destructive",
      });
    }
  });

  return (
    <fieldset disabled={isSubmitting}>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-y-5 gap-x-10">
        <div className="space-y-3 col-span-2">
          <Label htmlFor="productName">Product's Name</Label>
          <Input id="productName" type="text" {...register("name")} />
          {errors?.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <Label htmlFor="categories">Category</Label>
          <Input
            placeholder="motherboard, pc, computer"
            id="categories"
            type="text"
            {...register("categories")}
          />
          {errors?.categories ? (
            <p className="text-destructive text-xs">
              {errors.categories.message}
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
            {...register("price", { valueAsNumber: true })}
          />
          <Button
            className="top-6 left-0 absolute"
            variant="outline"
            size="icon"
            disabled
          >
            <DollarSignIcon />
          </Button>
          {errors?.price && (
            <p className="text-destructive text-xs">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="stock">Stock</Label>
          <Input
            {...register("stock", { valueAsNumber: true })}
            id="stock"
            type="number"
            step={1}
          />
          {errors?.stock && (
            <p className="text-destructive text-xs">{errors.stock.message}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Type your message here."
            id="description"
            {...register("description")}
          />
          {errors?.description && (
            <p className="text-destructive text-xs">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <div className="w-fit max-w-lg space-y-3">
            <Label htmlFor="images">Product's Photo</Label>
            <Input
              ref={inputFileRef}
              id="images"
              type="file"
              name="images"
              multiple
              accept="image/*"
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>
        </div>
        <Button type="submit" className="self-end max-w-xs mt-8">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Save
        </Button>
      </form>
    </fieldset>
  );
}

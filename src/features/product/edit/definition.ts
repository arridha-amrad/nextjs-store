import { z } from "zod";

export const editProductSchema = z.object({
  name: z.string().trim().min(1, "Product's name is required"),
  description: z.string().trim().min(1, "Product's description is required"),
  stock: z.number().gt(0),
  price: z.number().gt(0),
  categories: z.string().array(),
});

export type TEditProduct = z.infer<typeof editProductSchema> & {
  photos: string[];
  id: string;
};

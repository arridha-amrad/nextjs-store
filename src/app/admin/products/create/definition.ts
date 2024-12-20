import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product's name is required"),
  description: z.string().trim().min(1, "Product's description is required"),
  stock: z.number().gt(0),
  price: z.number().gt(0),
  categories: z.string().trim().min(1, "Product's category is required"),
});

export type TCreateProduct = z.infer<typeof createProductSchema>;

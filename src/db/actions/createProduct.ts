"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product's name is required"),
  description: z.string().trim().min(1, "Product's description is required"),
  stock: z.number().gt(0),
  price: z.number().gt(0),
  categories: z.array(z.string()),
});

export const createProduct = async (_: any, formData: FormData) => {
  const categories = formData.getAll("categories") as string[];
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  // const cookie = await cookies();
  // const supabase = createClient(cookie);

  const validateField = createProductSchema.safeParse({
    name,
    description,
    stock,
    price,
    categories,
  });

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
    };
  }

  return {
    result: "Ok",
  };
};

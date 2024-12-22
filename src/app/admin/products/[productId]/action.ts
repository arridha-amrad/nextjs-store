"use server";

import { createClient } from "@/lib/supabase/server";
import { editProductSchema } from "./definition";
import { cookies } from "next/headers";

export const editProductAction = async (
  _: any,
  formdata: FormData,
  userId: string
) => {
  const categories = formdata.get("categories") as string;
  const description = formdata.get("description") as string;
  const name = formdata.get("name") as string;
  const price = parseFloat(formdata.get("price") as string);
  const stock = parseInt(formdata.get("stock") as string);

  const validateField = editProductSchema.safeParse({
    categories,
    description,
    name,
    price,
    stock,
  });

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
    };
  }

  const cookie = await cookies();
  const sb = createClient(cookie);
  const arrCategories = categories.split(", ");

  // 1. check if categories already registered
  const { data: d, error: err } = await sb
    .from("categories")
    .select("*")
    .in("name", arrCategories);
  if (err || d === null) {
    return {
      error: "Something went wrong",
    };
  }

  // 2. check what categories attach to this product
  const { data: d4, error: err4 } = await sb
    .from("product_category")
    .select("*")
    .eq("product_id", userId);
  if (err4 || d4 === null) {
    return {
      error: "Something went wrong",
    };
  }

  //   const regCategories = d.map((d) => d.name);
  //   const revokedCategoriesOfProduct: string[] = [];
  //   for (const cat of arrCategories) {
  //     if (!regCategories.includes(cat)) {
  //       return;
  //     }
  //   }

  // 2. since every category is unique. insert same category will throw err
  const registeredCategories = d.map((v) => v.name);
  // 2.1. filter the categories we re going to insert against the already registered categories
  const categoriesToInsert = [];
  for (const cat of arrCategories) {
    if (!registeredCategories.includes(cat)) {
      categoriesToInsert.push(cat);
    }
  }

  // 3. insert the categories
  const { data: d2, error: err2 } = await sb
    .from("categories")
    .insert(categoriesToInsert.map((v) => ({ name: v })))
    .select("id");
  if (err2) throw err2;
  if (!d2) return;

  // 4. insert the product
  const { data: d3, error: err3 } = await sb
    .from("products")
    .update({
      description,
      name,
      price,
      stock,
    })
    .select()
    .single();
  if (err3) throw err3;
  if (d3 === null) return;

  // 5. tie each product with a category
  await sb.from("product_category").insert(
    [...d2, ...d].map((v) => ({
      product_id: d3.id,
      category_id: v.id,
    }))
  );

  console.log(validateField.data);
};

"use server";
import { Supabase } from "@/lib/supabase/Supabase";
import { createProductSchema } from "./definition";
import { v4 } from "uuid";
import { revalidateTag } from "next/cache";
import { CACHE_KEY_PRODUCTS } from "@/cacheKey";

export const createProduct = async (_: any, formData: FormData) => {
  const categories = formData.getAll("categories") as string[];
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const photos = formData.getAll("photos") as File[];

  console.log(categories);

  const validateField = createProductSchema.safeParse({
    name,
    categories,
    description,
    stock,
    price,
  });

  const photoTotalSize = photos.reduce((file, currFile) => {
    return file + currFile.size;
  }, 0);

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
    };
  }

  if (photoTotalSize > 1000 * 1000) {
    return {
      errorPhotos:
        "The photos you are trying to upload is too big. Only 1Mb is allowed. Make sure to compress them before upload",
    };
  }

  const supabase = await Supabase.initServerClient();

  const { data: newProduct, error: errNewProduct } = await supabase
    .from("products")
    .insert({
      description,
      name,
      price,
      stock,
    })
    .select()
    .single();

  if (errNewProduct) {
    return {
      error: errNewProduct.message,
    };
  }

  const { data: newCategories, error: errNewCategories } = await supabase
    .from("categories")
    .upsert(
      categories.map((v) => ({
        name: v,
      })),
      {
        ignoreDuplicates: false,
        onConflict: "name",
      }
    )
    .select();

  if (errNewCategories) {
    return {
      error: errNewCategories.message,
    };
  }

  if (!newCategories || !newProduct) {
    return {
      error: "Something went wrong",
    };
  }

  await supabase.from("product_category").insert(
    newCategories.map((v) => ({
      product_id: newProduct.id,
      category_id: v.id,
    }))
  );

  const filePaths: string[] = [];
  for (const file of photos) {
    const productId = newProduct.id;
    const uniqueFileName = v4();
    const fileExtension = file.type.split("/")[1];
    const { data, error } = await supabase.storage
      .from("products")
      .upload(`${productId}/${uniqueFileName}.${fileExtension}`, file);
    if (error) {
      console.log(error);
    }
    if (data) {
      filePaths.push(data?.path);
    }
  }

  await supabase.from("product_photo").insert(
    filePaths.map((v) => ({
      url: v,
      product_id: newProduct.id,
    }))
  );

  revalidateTag(CACHE_KEY_PRODUCTS);

  return {
    message: "New product added successfully",
  };
};

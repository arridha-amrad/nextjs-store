"use server";

import { createClient } from "@/lib/supabase/client";

export const actionCategoriesWithCreatableSelect = async (
  _: any,
  formdata: FormData
) => {
  const categories = formdata.getAll("categories") as string[];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .upsert(
      categories.map((v) => ({
        name: v.toLowerCase(),
      })),
      {
        ignoreDuplicates: false,
        onConflict: "name",
      }
    )
    .select();
  if (error) {
    console.log(error);
  }
  if (data === null) {
    return {
      error: "Data is null",
    };
  }

  console.log(data);

  return {
    data,
  };
};

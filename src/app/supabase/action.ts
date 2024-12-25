"use server";

export const actionCategoriesWithCreatableSelect = async (
  _: any,
  formdata: FormData
) => {
  const categories = formdata.getAll("categories");
  console.log({ categories });
};

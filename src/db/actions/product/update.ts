'use server'

import {
  CACHE_KEY_PRODUCT_ON_ADMIN,
  CACHE_KEY_PRODUCTS_ON_ADMIN,
  CACHE_KEY_PRODUCTS_ON_CUSTOMER,
} from '@/cacheKey'
import { createProductSchema } from '@/lib/definitions/product'
import { SafeActionError } from '@/lib/errors/SafeActionError'
import { authActionClient } from '@/lib/safeAction'
import { Supabase } from '@/lib/supabase/Supabase'
import { revalidateTag } from 'next/cache'
import { v4 } from 'uuid'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

const schema = zfd.formData({
  categories: zfd
    .text()
    .or(zfd.text().array())
    .transform((v) => {
      if (typeof v === 'string') {
        return [v]
      }
      return v
    }),
  description: zfd.text(z.string().min(1)),
  name: zfd.text(z.string().min(1)),
  price: zfd.numeric(z.number().gt(1)),
  stock: zfd.numeric(z.number().gt(1)),
  photos: zfd
    .file()
    .or(zfd.file().array())
    .optional()
    .transform(async (val) => {
      if (val instanceof File) {
        return [val]
      }
      if (typeof val === 'undefined') {
        return []
      }
      return val
    })
    .refine(
      async (files) => {
        const total = files.reduce((pv, cv) => pv + cv.size, 0)
        return total < 1000000
      },
      { message: 'File must be <= 1 MB' },
    ),
})

export const updateProduct = authActionClient
  .schema(schema)
  .bindArgsSchemas<[productId: z.ZodString]>([z.string().uuid()])
  .action(
    async ({
      bindArgsParsedInputs: [productId],
      parsedInput: { categories, description, name, photos, price, stock },
      ctx: { supabase },
    }) => {
      const paths: string[] = []
      for (const photo of photos) {
        const filename = v4()
        const ext = photo.type.split('/')[1]
        const { data, error } = await supabase.storage
          .from('products')
          .upload(`${productId}/${filename}.${ext}`, photo)

        if (error) {
          console.log(error)
          throw new SafeActionError(error.message)
        }
        if (data) {
          paths.push(data.path)
        }
      }
      const { data: updateResult, error: errUpdate } = await supabase.rpc(
        'update_product',
        {
          u_product_id: productId,
          u_categories: categories,
          product_description: description,
          product_file_paths: paths,
          product_name: name,
          product_price: price,
          product_stock: stock,
        },
      )

      if (errUpdate) {
        console.log(errUpdate)
        throw new SafeActionError(errUpdate.message)
      }

      revalidateTag(CACHE_KEY_PRODUCT_ON_ADMIN)
      revalidateTag(CACHE_KEY_PRODUCTS_ON_ADMIN)
      revalidateTag(CACHE_KEY_PRODUCTS_ON_CUSTOMER)

      return updateResult
    },
  )

// Left for learning purpose. but it 100% works as above
export const editProductAction__ = async (_: unknown, formdata: FormData) => {
  const productId = formdata.get('productId') as string
  const categories = formdata.getAll('categories') as string[]
  const description = formdata.get('description') as string
  const name = formdata.get('name') as string
  const price = parseFloat(formdata.get('price') as string)
  const stock = parseInt(formdata.get('stock') as string)
  const photos = formdata.getAll('photos') as File[]

  const validateField = createProductSchema.safeParse({
    categories,
    description,
    name,
    price,
    stock,
  })

  if (!validateField.success) {
    return {
      errors: validateField.error.flatten().fieldErrors,
    }
  }

  const sb = await Supabase.initServerClient()

  // 1. upsert categories
  const { data: upsertedCategories, error: errorUpsertedCategories } = await sb
    .from('categories')
    .upsert(
      categories.map((v) => ({
        name: v,
      })),
      { ignoreDuplicates: false, onConflict: 'name' },
    )
    .select()

  if (errorUpsertedCategories) {
    return {
      error: errorUpsertedCategories.message,
    }
  }

  // 2. update the product
  const { error: errorUpdate } = await sb
    .from('products')
    .update({
      description,
      name,
      price,
      stock,
    })
    .eq('id', productId)

  if (errorUpdate) {
    console.log(errorUpdate)
    return {
      error: errorUpdate.message,
    }
  }

  if (upsertedCategories) {
    const { data, error: err } = await sb
      .from('product_categories')
      .select(
        `*, categories(
          name
        )`,
      )
      .eq('product_id', productId)
    if (err) {
      console.log(err)
      return {
        error: err.message,
      }
    }

    if (!data) {
      return {
        error: 'Something went wrong',
      }
    }

    // removed canceled categories
    const arrNameUpsertedCategories = upsertedCategories.map((v) => v.name)
    for (const old of data) {
      if (!arrNameUpsertedCategories.includes(old.categories.name)) {
        await sb
          .from('product_categories')
          .delete()
          .eq('category_id', old.category_id)
          .eq('product_id', productId)
      }
    }

    // 3. tie each category with its product
    await sb.from('product_categories').upsert(
      upsertedCategories.map((v) => ({
        product_id: productId,
        category_id: v.id,
      })),
      {
        ignoreDuplicates: false,
        onConflict: 'product_id,category_id',
      },
    )
  }

  // 4 insert photos
  const paths: string[] = []
  for (const photo of photos) {
    const filename = v4()
    const ext = photo.type.split('/')[1]
    const { data, error } = await sb.storage
      .from('products')
      .upload(`${productId}/${filename}.${ext}`, photo)
    if (error) {
      return {
        error: error.message,
      }
    }
    if (data) {
      paths.push(data.path)
    }
  }

  // 5. tie photos with product
  const { error } = await sb.from('product_photos').insert(
    paths.map((v) => ({
      url: v,
      product_id: productId,
    })),
  )

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidateTag(CACHE_KEY_PRODUCT_ON_ADMIN)
  revalidateTag(CACHE_KEY_PRODUCTS_ON_ADMIN)

  return {
    message: 'Product updated successfully',
  }
}

'use server'

import { CACHE_KEY_PRODUCTS_ON_ADMIN } from '@/cacheKey'
import { SafeActionError } from '@/lib/errors/SafeActionError'
import { authActionClient } from '@/lib/safeAction'
import { revalidateTag } from 'next/cache'
import { v4 } from 'uuid'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const createProduct = authActionClient
  .schema(
    zfd.formData({
      categories: zfd
        .text()
        .or(zfd.text().array())
        .transform(async (val) => {
          if (typeof val === 'string') {
            return [val]
          }
          return val
        }),
      name: zfd.text(z.string()),
      price: zfd.numeric(z.number().gt(0)),
      stock: zfd.numeric(z.number().gt(0)),
      description: zfd.text(z.string()),
      photos: zfd
        .file()
        .or(zfd.file().array())
        .transform(async (val) => {
          if (val instanceof File) {
            return [val]
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
    }),
  )
  .action(
    async ({
      ctx: { supabase },
      parsedInput: { categories, photos, description, name, price, stock },
    }) => {
      const filePaths: string[] = []
      for (const file of photos) {
        const uniqueFileName = v4()
        const fileExtension = file.type.split('/')[1]
        const { data, error } = await supabase.storage
          .from('products')
          .upload(`${uniqueFileName}.${fileExtension}`, file)
        if (error) {
          console.log(error)
        }
        if (data) {
          filePaths.push(data?.path)
        }
      }
      const { error } = await supabase.rpc('add_product', {
        new_categories: categories,
        new_description: description,
        new_filepaths: filePaths,
        new_name: name,
        new_price: price,
        new_stock: stock,
      })
      if (error) {
        throw new SafeActionError(error.message)
      }

      revalidateTag(CACHE_KEY_PRODUCTS_ON_ADMIN)

      return 'New product was added successfully'
    },
  )

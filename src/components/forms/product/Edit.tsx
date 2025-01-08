'use client'

import DeletePhoto from '@/components/alertDialog/DeletePhoto'
import AddStock from '@/components/dialog/AddStock'
import MyTooltip from '@/components/MyTooltip'
import SelectCategories from '@/components/SelectCategories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabaseStorageBaseUrl } from '@/config'
import { editProductAction } from '@/db/actions/product/edit'
import { useToast } from '@/hooks/use-toast'
import { TEditProduct } from '@/lib/definitions/product'
import { DollarSignIcon, Loader, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { useActionState, useEffect, useRef, useState } from 'react'

type Props = {
  props: TEditProduct
}

export default function FormEditProduct({ props }: Props) {
  const { categories, description, name, photos, price, stock, id } = props
  const [newStockValue, setNewStockValue] = useState(stock)
  const { toast } = useToast()

  const hiddenInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])

  const [state, action, isPending] = useActionState(
    editProductAction,
    undefined,
  )

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      console.log(url)
      setPreviews([...previews, url])
      setFilesToUpload([...filesToUpload, file])
    }
    // eslint-disable-next-line
  }, [file])

  useEffect(() => {
    if (state?.message) {
      toast({
        description: state.message,
      })
      setPreviews([])
      setFilesToUpload([])
    }
    // eslint-disable-next-line
  }, [state?.message])

  useEffect(() => {
    if (state?.error) {
      toast({
        description: state.error,
        variant: 'destructive',
      })
    }
    // eslint-disable-next-line
  }, [state?.error])

  return (
    <fieldset disabled={isPending}>
      <form
        action={(data) => {
          for (const file of filesToUpload) {
            data.append('photos', file)
          }
          action(data)
        }}
        className="grid grid-cols-2 gap-y-5 gap-x-10"
      >
        <input type="text" hidden name="productId" defaultValue={id} />
        <div className="space-y-3 col-span-2">
          <Label htmlFor="productName">Product&apos;s Name</Label>
          <Input id="productName" type="text" name="name" defaultValue={name} />
          {state?.errors?.name && (
            <p className="text-destructive text-xs">{state?.errors?.name[0]}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <SelectCategories
            defaultValue={categories.map((v) => ({ label: v, value: v }))}
          />
          {state?.errors?.categories && (
            <p className="text-destructive text-xs">
              {state?.errors.categories[0]}
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
            name="price"
            defaultValue={price}
          />
          <Button
            className="top-6 left-0 absolute"
            variant="outline"
            size="icon"
            disabled
          >
            <DollarSignIcon />
          </Button>
          {state?.errors?.price && (
            <p className="text-destructive text-xs">{state?.errors.price[0]}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label htmlFor="stock">Stock</Label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              id="stock"
              type="number"
              step={1}
              name="stock"
              className="read-only:text-muted-foreground"
              value={newStockValue}
            />
            <AddStock setValue={setNewStockValue} />
          </div>
          {state?.errors?.stock && (
            <p className="text-destructive text-xs">{state?.errors.stock[0]}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Type your message here."
            id="description"
            name="description"
            defaultValue={description}
          />
          {state?.errors?.description && (
            <p className="text-destructive text-xs">
              {state?.errors.description[0]}
            </p>
          )}
        </div>

        <div className="flex mt-5 items-center gap-3 col-span-2">
          {photos.map((v, i) => (
            <div
              key={i}
              className="rounded-lg group relative cursor-pointer flex items-center justify-center aspect-square max-w-[200px]"
            >
              <div className="absolute inset-0  group-hover:bg-black/65 transition-all duration-200 ease-linear" />
              <Image
                priority
                className="w-full h-auto object-fill object-center"
                width={500}
                height={500}
                src={`${supabaseStorageBaseUrl}/${v}`}
                alt="product_photo"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 ease-linear transition-opacity">
                <DeletePhoto />
              </div>
            </div>
          ))}

          {previews.map((v, i) => (
            <div
              key={i}
              className="rounded-lg group relative cursor-pointer flex items-center justify-center aspect-square max-w-[200px]"
            >
              <div className="absolute inset-0  group-hover:bg-black/65 transition-all duration-200 ease-linear" />
              <Image
                className="w-full h-auto object-fill object-center"
                width={500}
                height={500}
                src={v}
                alt="product_photo"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 ease-linear transition-opacity">
                <DeletePhoto />
              </div>
            </div>
          ))}

          {photos.length + previews.length < 4 && (
            <MyTooltip content="Add More Photo">
              <div
                onClick={() => {
                  hiddenInputRef.current?.click()
                }}
                className="rounded-full cursor-pointer border flex items-center justify-center w-14 aspect-square"
              >
                <input
                  ref={hiddenInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const newFiles = e.target.files
                    if (newFiles) {
                      console.log(newFiles)
                      setFile(newFiles[0])
                    }
                  }}
                />
                <PlusIcon className="text-slate-700" />
              </div>
            </MyTooltip>
          )}
        </div>
        <div className="col-span-full">
          <p className="text-muted-foreground text-sm">
            *Please upload photos less than 1000 Kb
          </p>
        </div>
        <div className="mt-5 mb-20">
          <Button type="submit" className="max-w-sm w-full">
            {isPending && <Loader className="animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </fieldset>
  )
}

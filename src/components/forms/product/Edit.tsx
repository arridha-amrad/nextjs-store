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
import { updateProduct } from '@/db/actions/product/update'
import { useToast } from '@/hooks/use-toast'
import { TEditProduct } from '@/lib/definitions/product'
import { DollarSignIcon, Loader, PlusIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  props: TEditProduct
}

export default function FormEditProduct({ props }: Props) {
  const { categories, description, name, photos, price, stock, id } = props
  const { toast } = useToast()

  const { execute, isPending, result } = useAction(
    updateProduct.bind(null, id),
    {
      onError({ error: { serverError } }) {
        if (serverError) {
          toast({
            description: serverError,
            variant: 'destructive',
          })
        }
      },
      onSuccess({ data }) {
        if (data) {
          toast({
            description: data,
          })
          setPreviews([])
          setFilesToUpload([])
        }
      },
    },
  )

  const nameError = result.validationErrors?.name?._errors
  const categoriesError = result.validationErrors?.categories?._errors
  const descriptionError = result.validationErrors?.description?._errors
  const photosError = result.validationErrors?.photos?._errors
  const stockError = result.validationErrors?.stock?._errors
  const priceError = result.validationErrors?.price?._errors

  const [newStockValue, setNewStockValue] = useState(stock)

  const hiddenInputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviews([...previews, url])
      setFilesToUpload([...filesToUpload, file])
    }
    // eslint-disable-next-line
  }, [file])

  const removeFromPreview = (i: number) => {
    const filteredPreviews = previews.filter((_, j) => j !== i)
    const filteredFiles = filesToUpload.filter((_, j) => j !== i)
    setPreviews(filteredPreviews)
    setFilesToUpload(filteredFiles)
  }

  return (
    <fieldset disabled={isPending}>
      <form
        action={(data) => {
          for (const file of filesToUpload) {
            data.append('photos', file)
          }
          execute(data)
        }}
        className="grid grid-cols-2 gap-y-5 gap-x-10"
      >
        <div className="space-y-3 col-span-2">
          <Label htmlFor="productName">Product&apos;s Name</Label>
          <Input id="productName" type="text" name="name" defaultValue={name} />
          {nameError && (
            <p className="text-destructive text-xs">{nameError[0]}</p>
          )}
        </div>
        <div className="space-y-3 col-span-2">
          <SelectCategories
            defaultValue={categories.map((v) => ({ label: v, value: v }))}
          />
          {categoriesError && (
            <p className="text-destructive text-xs">{categoriesError[0]}</p>
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
          {priceError && (
            <p className="text-destructive text-xs">{priceError[0]}</p>
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
          {stockError && (
            <p className="text-destructive text-xs">{stockError[0]}</p>
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
          {descriptionError && (
            <p className="text-destructive text-xs">{descriptionError[0]}</p>
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
                className="w-full aspect-square h-auto object-cover object-center"
                width={500}
                height={500}
                src={`${supabaseStorageBaseUrl}/${v}`}
                alt="product_photo"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 ease-linear transition-opacity">
                <DeletePhoto productId={id} filePath={v} />
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
                className="w-full aspect-square h-auto object-cover object-center"
                width={500}
                height={500}
                src={v}
                alt="product_photo"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 ease-linear transition-opacity">
                <Button
                  type="button"
                  onClick={() => removeFromPreview(i)}
                  variant="destructive"
                >
                  Delete
                </Button>
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
                      setFile(newFiles[0])
                    }
                  }}
                />
                <PlusIcon className="text-slate-700" />
              </div>
            </MyTooltip>
          )}
          {photosError && (
            <p className="text-destructive text-xs">{photosError[0]}</p>
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

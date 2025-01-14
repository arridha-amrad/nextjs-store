'use client'

import SelectCategories, {
  SelectCategoriesHandler,
} from '@/components/SelectCategories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProduct } from '@/db/actions/product/create'

import { useToast } from '@/hooks/use-toast'
import { Loader } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'

export default function FormCreateProduct() {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    photosTotalSize: 0,
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()

  const { execute, isPending, result } = useAction(createProduct, {
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
          description: 'new product added',
        })
        setFormState({
          ...formState,
          name: '',
          description: '',
          price: 0,
          stock: 0,
          photosTotalSize: 0,
        })
        setFiles([])
        categoriesRef.current?.resetCategories()
      }
    },
  })

  const nameError = result.validationErrors?.name?._errors
  const categoriesError = result.validationErrors?.categories?._errors
  const stockError = result.validationErrors?.stock?._errors
  const descriptionError = result.validationErrors?.description?._errors
  const photosError = result.validationErrors?.photos?._errors
  const priceError = result.validationErrors?.price?._errors

  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const categoriesRef = useRef<SelectCategoriesHandler>(null)
  const { description, name, price, stock, photosTotalSize } = formState

  useEffect(() => {
    if (files.length > 0) {
      let total = 0
      for (const file of files) {
        total += file.size
      }
      setFormState({
        ...formState,
        photosTotalSize: total,
      })
    }
    // eslint-disable-next-line
  }, [files])

  return (
    <fieldset disabled={isPending}>
      <form
        action={(formdata) => {
          for (const file of files) {
            formdata.append('photos', file)
          }
          execute(formdata)
        }}
        className="grid grid-cols-2 gap-y-5 gap-x-10"
      >
        <div className="space-y-3 col-span-2">
          <Label htmlFor="productName">Product&apos;s Name</Label>
          <Input
            id="productName"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
          />
          {nameError && (
            <p className="text-destructive text-xs">{nameError[0]}</p>
          )}
        </div>
        <div className="col-span-2 space-y-3">
          <SelectCategories ref={categoriesRef} />
          {categoriesError && (
            <p className="text-destructive text-xs">{categoriesError[0]}</p>
          )}
        </div>

        <div className="space-y-3 ">
          <Label htmlFor="price">Price</Label>
          <div className="relative">
            <Input
              id="price"
              className="pl-12"
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
            />
            <div className="absolute top-0 left-0">
              <Button variant="ghost" size="icon">
                Rp
              </Button>
            </div>
          </div>
          {priceError && (
            <p className="text-destructive text-xs">{priceError[0]}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            step={1}
            name="stock"
            value={stock}
            onChange={handleChange}
          />
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
            value={description}
            onChange={(e) => {
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }}
          />
          {descriptionError && (
            <p className="text-destructive text-xs">{descriptionError[0]}</p>
          )}
        </div>

        <div className="col-span-2">
          <div className="w-fit max-w-lg space-y-3">
            <Label htmlFor="photos">Product&apos;s Photo</Label>
            <Input
              ref={inputFileRef}
              id="photos"
              onChange={(e) => {
                const f = e.target.files as unknown
                setFiles(f as File[])
              }}
              type="file"
              multiple
              accept="image/*"
            />
            {photosError ? (
              <p className="text-xs text-destructive">{photosError}</p>
            ) : formState.photosTotalSize === 0 ? (
              <p className="text-xs text-muted-foreground">
                Please provide photos less than 1000 Kb
              </p>
            ) : (
              <p className="text-xs">
                Total size : {Math.ceil(photosTotalSize / 1000)} Kb
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="self-end max-w-xs mt-8">
          {isPending && <Loader className="animate-spin" />}
          Save
        </Button>
      </form>
    </fieldset>
  )
}

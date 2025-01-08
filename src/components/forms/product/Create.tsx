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
import {
  ChangeEventHandler,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'

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
  const [state, action, pending] = useActionState(createProduct, undefined)
  const { toast } = useToast()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const categoriesRef = useRef<SelectCategoriesHandler>(null)
  const { description, name, price, stock, photosTotalSize } = formState

  useEffect(() => {
    if (state?.message) {
      toast({
        description: state.message,
      })
      categoriesRef.current?.resetCategories()
      setFormState({
        ...formState,
        description: '',
        name: '',
        price: 0,
        stock: 0,
      })
    }
    // eslint-disable-next-line
  }, [state?.message, pending])

  useEffect(() => {
    if (state?.error) {
      toast({
        description: state.error,
        variant: 'destructive',
      })
    }
    // eslint-disable-next-line
  }, [state?.error, pending])

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
    <fieldset disabled={pending}>
      <form
        action={(formdata) => {
          for (const file of files) {
            formdata.append('photos', file)
          }
          action(formdata)
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
          {state?.errors?.name && (
            <p className="text-destructive text-xs">{state?.errors.name[0]}</p>
          )}
        </div>
        <div className="col-span-2 space-y-3">
          <SelectCategories ref={categoriesRef} />
          {state?.errors?.categories && (
            <p className="text-destructive text-xs">
              {state?.errors.categories[0]}
            </p>
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
          {state?.errors?.price && (
            <p className="text-destructive text-xs">{state?.errors.price[0]}</p>
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
            value={description}
            onChange={(e) => {
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }}
          />
          {state?.errors?.description && (
            <p className="text-destructive text-xs">
              {state?.errors.description[0]}
            </p>
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
            {state?.errorPhotos ? (
              <p className="text-xs text-destructive">{state?.errorPhotos}</p>
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
          {pending && <Loader className="animate-spin" />}
          Save
        </Button>
      </form>
    </fieldset>
  )
}

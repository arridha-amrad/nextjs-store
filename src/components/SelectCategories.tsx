'use client'

import { createClient } from '@/lib/supabase/client'
import { Label } from '@radix-ui/react-label'
import dynamic from 'next/dynamic'
import { Ref, useImperativeHandle, useState } from 'react'
const CreatableSelect = dynamic(() => import('react-select/async-creatable'), {
  ssr: false,
})

type Option = {
  value: string
  label: string
}

type Props = {
  defaultValue?: Option[]
  ref?: Ref<SelectCategoriesHandler>
}

export type SelectCategoriesHandler = {
  resetCategories: () => void
}

export default function SelectCategories({ defaultValue, ref }: Props) {
  const [isFocusCategory, setFocusCategory] = useState(false)

  const [value, setValue] = useState<Option[]>(defaultValue ?? [])

  useImperativeHandle(
    ref,
    () => {
      return {
        resetCategories() {
          setValue([])
        },
      }
    },
    [],
  )

  const loadCategories = async (value: string) => {
    const sb = createClient()
    const { data } = await sb.from('categories').select('*')
    if (!data) return []
    const options = data.map((v) => ({
      label: v.name,
      value: v.name,
    }))
    return options.filter((v) =>
      v.label.toLowerCase().includes(value.toLowerCase()),
    )
  }

  return (
    <div className="space-y-3 relative">
      {isFocusCategory && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      <Label className="text-sm relative" htmlFor="categories">
        Categories
      </Label>
      <CreatableSelect
        id="categories"
        name="categories"
        onChange={(v) => {
          setValue(v as Option[])
        }}
        value={value}
        unstyled
        onBlur={() => setFocusCategory(false)}
        onFocus={() => setFocusCategory(true)}
        classNames={{
          container: () => 'border border-input rounded-md bg-background',
          valueContainer: () => 'space-x-1',
          multiValueRemove: () => 'hover:text-red-500',
          multiValue: () =>
            'bg-primary rounded-md text-primary-foreground px-2 py-0.5 space-x-2 text-sm',
          menu: () =>
            'border-2 mt-2 border-primary/30 cursor-pointer rounded-md bg-background overflow-hidden',
          menuList: () => 'text-primary',
          placeholder: () => 'text-muted-foreground pl-1',
          option: () => 'bg-background hover:bg-primary/20 px-4 py-2',
          control: (state) =>
            `p-2 ${
              state.isFocused
                ? 'ring-2 ring-primary rounded-md ring-offset-background'
                : ''
            }`,
        }}
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadCategories}
      />
    </div>
  )
}

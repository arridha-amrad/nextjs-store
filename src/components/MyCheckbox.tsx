'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { CheckboxProps } from '@radix-ui/react-checkbox'

type Props = {
  label: string
} & CheckboxProps

export default function MyCheckBox({ label, ...props }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...props} />
      <label
        htmlFor={props.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
}

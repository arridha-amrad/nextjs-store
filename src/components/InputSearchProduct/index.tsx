'use client'

import Form from 'next/form'
import { useSearchParams } from 'next/navigation'
import { Input } from '../ui/input'
import ButtonSubmit from './ButtonSubmit'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'

function InputSearchProduct() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [value, setValue] = useState(searchParams.get('search') ?? '')
  return (
    <Form action="/" className="relative w-full">
      <div className="absolute top-0 left-0">
        <ButtonSubmit />
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="search"
        className="w-full pl-14"
        placeholder="Search in nextstore"
      />
      <div className="absolute top-0 right-0">
        <Button
          type="button"
          onClick={() => {
            setValue('')
            router.push('/?search=')
          }}
          variant="ghost"
          size="icon"
        >
          <X />
        </Button>
      </div>
    </Form>
  )
}

export default InputSearchProduct

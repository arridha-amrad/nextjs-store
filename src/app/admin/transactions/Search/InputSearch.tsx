'use client'

import { Input } from '@/components/ui/input'
import Form from 'next/form'
import ButtonSubmit from './ButtonSubmit'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'nextjs-toploader/app'
import { X } from 'lucide-react'

function InputSearch() {
  const params = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(params.get('invoice') ?? '')

  return (
    <Form action="" className="relative w-full max-w-md flex-1">
      <div className="absolute top-0 left-0">
        <ButtonSubmit />
      </div>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        name="invoice"
        className="w-full px-14 "
        placeholder="Search invoice..."
      />
      <div className="absolute top-0 right-0">
        <Button
          type="button"
          onClick={() => {
            setSearch('')
            router.push('/admin/transactions')
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

export default InputSearch

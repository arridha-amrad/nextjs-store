'use client'

import { Button } from '@/components/ui/button'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import Form from 'next/form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = {
  totalPages: number
}

function PageIndicator({ totalPages }: Props) {
  const params = useSearchParams()
  const strPage = params.get('page') ?? ''
  const isNumber = !isNaN(parseInt(strPage))
  const [page, setPage] = useState(
    strPage === '' ? 1 : isNumber ? parseInt(strPage) : 1,
  )
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    formRef.current?.requestSubmit()
  }, [page])

  return (
    <Form action="" ref={formRef} className="flex items-center gap-4">
      <input name="page" hidden value={page} readOnly />
      <Button
        type="button"
        onClick={() => setPage((val) => val - 1)}
        disabled={page <= 1}
        size="icon"
        variant="ghost"
      >
        <ChevronsLeft />
      </Button>

      <Button disabled variant="ghost">
        {page} / {totalPages}
      </Button>

      <Button
        disabled={page >= totalPages}
        type="button"
        onClick={() => setPage((val) => val + 1)}
        size="icon"
        variant="ghost"
      >
        <ChevronsRight />
      </Button>
    </Form>
  )
}

export default PageIndicator

'use client'

import { Loader, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { useFormStatus } from 'react-dom'
import { Ref } from 'react'

function ButtonSubmit() {
  const status = useFormStatus()
  return (
    <Button type="submit" size="icon" variant="outline">
      {status.pending ? <Loader className="animate-spin" /> : <Search />}
    </Button>
  )
}

export default ButtonSubmit

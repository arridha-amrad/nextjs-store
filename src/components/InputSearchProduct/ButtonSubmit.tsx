'use client'

import { Loader, Search } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'

function ButtonSubmit() {
  const status = useFormStatus()
  return (
    <Button type="submit" size="icon" variant="outline">
      {status.pending ? <Loader className="animate-spin" /> : <Search />}
    </Button>
  )
}

export default ButtonSubmit

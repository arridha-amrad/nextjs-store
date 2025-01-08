'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MoreVertical } from 'lucide-react'
import Form from 'next/form'
import { useSearchParams } from 'next/navigation'
import { useRef } from 'react'

function StatusFilter() {
  const ref = useRef<HTMLFormElement | null>(null)

  const setStatusFilter = () => {
    ref.current?.requestSubmit()
  }

  const params = useSearchParams()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <MoreVertical />
          Status
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form ref={ref} action="">
          <RadioGroup
            onValueChange={setStatusFilter}
            defaultValue={params.get('status') ?? ''}
            name="status"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="on progress" id="r1" />
              <Label htmlFor="r1">On Progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="confirmed" id="r2" />
              <Label htmlFor="r2">Confirmed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shipping" id="r3" />
              <Label htmlFor="r3">Shipping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arrived" id="r3" />
              <Label htmlFor="r3">Arrived</Label>
            </div>
          </RadioGroup>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default StatusFilter

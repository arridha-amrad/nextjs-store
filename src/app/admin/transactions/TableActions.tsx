'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateTransaction } from '@/db/actions/transactions'
import { TransactionStatus } from '@/lib/definitions/transaction'
import { MoreVertical, Check, Ship } from 'lucide-react'

type Props = {
  status: TransactionStatus
  invoice: string
}

function TableActions({ status, invoice }: Props) {
  let index = 0
  switch (status) {
    case 'confirmed':
      index = 1
      break
    default:
      break
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            updateTransaction({ data: { invoice, status: 'confirmed' } })
          }
          disabled={index > 0}
        >
          <Check />
          Confirm
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            updateTransaction({ data: { invoice, status: 'shipping' } })
          }
          disabled={index === 0 || index > 1}
        >
          <Ship />
          Ship
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableActions

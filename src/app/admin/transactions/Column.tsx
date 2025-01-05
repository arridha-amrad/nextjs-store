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
import { updateTransactionStatus } from '@/db/actions/transactions'
import { TransactionTable } from '@/db/queries/transactions'
import { dateFormatterForTransactionDate, rupiahFormatter } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { Check, MoreVertical, Ship } from 'lucide-react'

export const columns: ColumnDef<TransactionTable>[] = [
  {
    accessorKey: 'No',
    header: () => <div className="w-fit">No</div>,
    cell({ row }) {
      return row.index + 1
    },
  },
  {
    accessorKey: 'action',
    header: '',
    size: 10,
    cell({ row }) {
      const status = row.getValue('status') as string
      const invoice = row.getValue('invoice') as string

      // status
      // on progress -> confirmed -> shipping -> arrived
      // 0 -> 1 -> 2 -> 3

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
              onClick={() => updateTransactionStatus(invoice, 'confirmed')}
              disabled={index > 0}
            >
              <Check />
              Confirm
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateTransactionStatus(invoice, 'shipping')}
              disabled={index === 0 || index > 1}
            >
              <Ship />
              Ship
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: 'invoice',
    header: 'Invoice',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'value',
    header: 'Amount',
    cell({ row }) {
      const data = rupiahFormatter.format(row.getValue('value'))
      return data
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell({ row }) {
      const data = dateFormatterForTransactionDate(
        new Date(row.getValue('created_at')),
      )
      return data
    },
  },
]

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
import { TransactionTable } from '@/db/queries/transactions'
import { dateFormatterForTransactionDate, rupiahFormatter } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<TransactionTable>[] = [
  {
    accessorKey: 'No',
    header: () => <div className="w-fit">No</div>,
    cell({ row }) {
      return row.index + 1
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
  {
    header: 'Actions',
    cell({ row }) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

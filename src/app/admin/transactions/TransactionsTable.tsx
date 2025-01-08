'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TransactionAdmin } from '@/lib/definitions/transaction'
import { dateFormatterForTransactionDate, rupiahFormatter } from '@/lib/utils'
import TableActions from './TableActions'

type Props = {
  transactions: TransactionAdmin['data']
}

function TransactionsTable({ transactions }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((tr, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{tr.invoice}</TableCell>
            <TableCell>{tr.status}</TableCell>
            <TableCell>
              <TableActions invoice={tr.invoice} status={tr.status} />
            </TableCell>
            <TableCell>
              {dateFormatterForTransactionDate(new Date(tr.created_at))}
            </TableCell>
            <TableCell className="text-right">
              {rupiahFormatter.format(tr.value)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable

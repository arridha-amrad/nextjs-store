import {
  getTransactionForAdmin,
  TransactionAdminFilter,
} from '@/db/queries/transactions'
import { cookies } from 'next/headers'
import PageIndicator from './PageIndicator'
import InputSearch from './Search/InputSearch'
import StatusFilter from './StatusFilter'
import TransactionsTable from './TransactionsTable'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Transaction({ searchParams }: Props) {
  const cookie = await cookies()

  const { page, invoice, status } =
    (await searchParams) as TransactionAdminFilter

  const transactions = await getTransactionForAdmin(cookie, {
    invoice,
    page,
    status,
  })

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight">
        All Transactions
      </h1>
      {/* {result && <DataTable columns={columns} data={result} />} */}
      {transactions.data && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="flex w-full justify-between items-center">
            <InputSearch />
            <StatusFilter />
          </div>
          <TransactionsTable transactions={transactions.data} />
          <div className="flex items-center justify-between w-full">
            <PageIndicator totalPages={transactions.totalPages} />
            <div>
              <h1 className="text-muted-foreground text-sm">
                List of transactions
              </h1>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                {transactions.count} Records
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { getTransactionForAdminCache } from '@/db/queries/transactions'
import { cookies } from 'next/headers'
import DataTable from './Table'
import { columns } from './Column'

export default async function Transaction() {
  const cookie = await cookies()
  const result = await getTransactionForAdminCache(cookie)

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight">
        All Transactions
      </h1>
      {result && <DataTable columns={columns} data={result} />}
    </div>
  )
}

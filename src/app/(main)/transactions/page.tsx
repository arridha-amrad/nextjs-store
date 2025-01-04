import { Transaction } from '@/lib/definitions/transaction'
import { Supabase } from '@/lib/supabase/Supabase'
import { cookies } from 'next/headers'

export default async function Page() {
  const supabase = await Supabase.initServerClient()
  const { data, error } = await supabase
    .from('transaction_details')
    .select()
    .returns<Transaction[]>()
  if (error) {
    console.log(error)
  }
  return (
    <div className="max-w-[1024px] mx-auto">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Transaction List</h1>
      </div>

      <main className="border rounded-lg p-4">
        {!data ? (
          <p>No transaction</p>
        ) : (
          <div>
            <div>
              <h1>Shop</h1>
              <p></p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

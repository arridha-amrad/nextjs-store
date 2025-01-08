import { supabaseStorageBaseUrl } from '@/config'
import { getCustomerTransactions } from '@/db/queries/transactions'
import { dateFormatter, rupiahFormatter } from '@/lib/utils'
import { cookies } from 'next/headers'
import Image from 'next/image'

export default async function Page() {
  const cookie = await cookies()
  const transactions = await getCustomerTransactions(cookie)
  return (
    <div className="max-w-[1024px] mx-auto">
      <div className="mb-5">
        <h1 className="font-bold text-2xl tracking-tight">Transaction List</h1>
      </div>
      <div className="">
        {!transactions ? (
          <p>No transaction</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div className="border rounded-lg p-4" key={t.id}>
                <div className="text-sm flex items-center gap-4">
                  <h1 className="font-bold">Shop</h1>
                  <p>{dateFormatter.format(new Date(t.created_at))}</p>
                  <p className="rounded py-1 px-3 bg-primary bg-opacity-50 text-background">
                    {t.status}
                  </p>
                  <p>{t.invoice}</p>
                </div>
                <div className="flex items-center">
                  <div className="space-y-2 py-4 flex-1 border-r">
                    {t.items.map(({ product, total_items }) => (
                      <div key={product.id} className="flex">
                        <div
                          className="flex flex-1 gap-4 items-start"
                          key={product.id}
                        >
                          <Image
                            className="rounded aspect-square object-cover"
                            width={100}
                            height={100}
                            alt="photo product"
                            src={`${supabaseStorageBaseUrl}/${product.photos[0]}`}
                          />
                          <div className="py-2 flex flex-col">
                            <h1 className="font-bold text-sm leading-relaxed">
                              {product.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                              <span>{total_items} item</span>
                              <span className="px-1">x</span>
                              <span>
                                {rupiahFormatter.format(product.price)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pl-10 pr-20">
                    <h1 className="text-muted-foreground text-sm">
                      Transaction values
                    </h1>
                    <p className="font-extrabold">
                      {rupiahFormatter.format(t.value)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

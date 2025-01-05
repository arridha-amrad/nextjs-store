import { supabaseStorageBaseUrl } from '@/config'
import { Transaction } from '@/lib/definitions/transaction'
import { Supabase } from '@/lib/supabase/Supabase'
import { dateFormatter, rupiahFormatter } from '@/lib/utils'
import Image from 'next/image'

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
      <div className="mb-5">
        <h1 className="font-bold text-2xl tracking-tight">Transaction List</h1>
      </div>
      <div className="">
        {!data ? (
          <p>No transaction</p>
        ) : (
          <div className="space-y-4">
            {data.map((t) => (
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
                    {t.items.map((product) => (
                      <div className="flex">
                        <div
                          className="flex flex-1 gap-4 items-start"
                          key={product.id}
                        >
                          <Image
                            className="rounded"
                            width={100}
                            height={100}
                            alt="photo product"
                            src={`${supabaseStorageBaseUrl}/${product.photos_url[0]}`}
                          />
                          <div className="py-2 flex flex-col">
                            <h1 className="font-bold text-sm leading-relaxed">
                              {product.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                              <span>{product.total_items} item</span>
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

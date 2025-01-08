import { Database } from '../../../database.types'

type TransactionItem = {
  product: TransactionProduct
  total_items: number
}

type TransactionProduct = {
  id: string
  name: string
  price: number
  photos: string[]
}

export type Transaction = {
  id: string
  value: number
  status: Database['public']['Enums']['order_status']
  created_at: Date
  invoice: string
  items: TransactionItem[]
}

export type TransactionTable = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const payments: TransactionTable[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
]

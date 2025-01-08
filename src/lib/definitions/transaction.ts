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

export type TransactionStatus = Database['public']['Enums']['order_status']

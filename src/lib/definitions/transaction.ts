import { Database } from '../../../database.types'

type TransactionProduct = {
  id: string
  name: string
  price: number
  photos_url: string[]
  total_items: number
}

export type Transaction = {
  id: string
  value: number
  status: Database['public']['Enums']['order_status']
  created_at: Date
  invoice: string
  items: TransactionProduct[]
}

export type TransactionStatus = Database['public']['Enums']['order_status']

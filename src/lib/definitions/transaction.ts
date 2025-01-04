import { Database } from '../../../database.types'

type TransactionProduct = {
  id: string
  name: string
  price: number
  photos_url: string[]
}

export type Transaction = {
  id: string
  value: number
  status: Database['public']['Enums']['order_status']
  created_at: Date
  total_items: number
  items: TransactionProduct[]
}

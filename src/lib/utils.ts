import { clsx, type ClassValue } from 'clsx'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { twMerge } from 'tailwind-merge'
import { createClient } from './supabase/server'
import { cache } from 'react'
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeHtml(text: string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (text) => {
    // @ts-ignore
    return map[text]
  })
}

export const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
})

export const generateInvoice = () => {
  const nanoid = customAlphabet('1234567890QWERTYUIOPLKJHGFDSAZXCVBNM', 8)
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0')

  const formattedDate = `${year}${month}${day}`

  return `INV/${formattedDate}/${nanoid()}`
}

export const dateFormatterForTransactionDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0')

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const amPm = hours >= 12 ? 'PM' : 'AM'

  // Convert hours to 12-hour format
  hours = hours % 12 || 12 // Convert 0 to 12 for midnight

  // Combine the date and time in the desired format
  const formattedDateTime = `${year}-${month}-${day}, ${hours}.${minutes} ${amPm}`
  return formattedDateTime
}

export const getAuthUserAndClient = cache(
  async (cookie: ReadonlyRequestCookies) => {
    const sb = createClient(cookie)
    const {
      data: { user },
      error,
    } = await sb.auth.getUser()
    if (error) {
      console.log(error)
    }

    return {
      supabase: sb,
      user,
    }
  },
)

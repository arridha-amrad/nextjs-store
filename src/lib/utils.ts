import { clsx, type ClassValue } from 'clsx'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { twMerge } from 'tailwind-merge'
import { createClient } from './supabase/server'
import { cache } from 'react'

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

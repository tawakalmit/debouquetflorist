'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(201, 168, 76, 0.2)',
          color: '#e5e5e5',
        },
      }}
    />
  )
}

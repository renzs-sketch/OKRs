import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OKR Pulse',
  description: 'Weekly OKR updates & executive reporting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

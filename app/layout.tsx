import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Comfortaa } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const robotoMono = Comfortaa({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OKR Pulse',
  description: 'Weekly OKR updates & executive reporting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${robotoMono.variable}`}>{children}</body>
    </html>
  )
}

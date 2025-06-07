import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Import the AppProviders wrapper
import { AppProviders } from '@/lib/providers/AppProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADMPF - AI-Driven Digital Micro-Product Factory',
  description: 'Create and sell digital micro-products powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}

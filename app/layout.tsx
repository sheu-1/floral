import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/lib/store/cart'
import { AuthProvider } from '@/lib/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'Shillah Flowers - Elegant Event Decorations & Floral Services',
  description: 'Transform your special moments with our exquisite floral arrangements and event decoration services. Weddings, birthdays, corporate events, and seasonal celebrations.',
  keywords: 'flowers, event decoration, wedding flowers, birthday decorations, corporate events, floral arrangements',
  authors: [{ name: 'Shillah Flowers' }],
  openGraph: {
    title: 'Shillah Flowers - Elegant Event Decorations',
    description: 'Transform your special moments with our exquisite floral arrangements and event decoration services.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-floral">
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

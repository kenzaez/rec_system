import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const lato = Lato({ 
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Peachy Glow | Beauty & Personal Care',
  description: 'Discover luxurious beauty and personal care products that bring out your natural radiance. Premium skincare, haircare, and wellness essentials.',
  generator: 'v0.app',
  // 👆 icons block deleted
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

/*
'use client'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from '../config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// إنشاء عميل الاستعلام
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}*/

'use client'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '../config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'

// إنشاء عميل الاستعلام
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <Head>
        <title>شراكة إسلامية - منصة استثمارية</title>
        <meta name="description" content="منصة شراكة إسلامية لتوزيع الأرباح بشكل عادل حسب الشريعة الإسلامية" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gradient-to-br from-green-50 to-cyan-50 min-h-screen">
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider 
              theme={darkTheme({
                accentColor: '#047857',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                fontStack: 'system',
              })}
              modalSize="compact"
            >
              <div className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-12 text-center">
                  <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                    🌙 منصة شراكة إسلامية
                  </h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    منصة استثمارية توزع الأرباح بشكل عادل حسب أحكام الشريعة الإسلامية
                  </p>
                </header>
                
                {children}
                
                <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                  <p>© 2025 منصة شراكة إسلامية. جميع الحقوق محفوظة.</p>
                  <p className="mt-2">تم تطوير المنصة بواسطة المهندس محمد غزال</p>
                </footer>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
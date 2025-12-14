import type React from "react"
import type { Metadata } from "next"
import { Inter, Pacifico } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Euquefiz - Produtos Artesanais para Casa",
  description: "Produtos artesanais únicos para transformar sua casa em um lar ainda mais especial",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${pacifico.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

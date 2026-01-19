

import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CombinedProviders } from "@/components/providers"
import { Header } from "@/components/header" // Importe seu Header 
import { Footer } from "@/components/footer" // Importe seu Footer se tiver
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Euquefiz",
    template: "%s | Euquefiz"
  },
  description: "euque",
  keywords: ["calçados", "sandálias", "ecommerce", "moda"],
  authors: [{ name: "Euquefiz" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://euquefiz.com",
    title: "Euquefiz",
    description: "Catálogo Digital de Produtos",
    siteName: "Euquefiz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Euquefiz",
    description: "Catálogo Digital de Produtos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html lang="pt-BR" suppressHydrationWarning className={montserrat.variable}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <CombinedProviders>
          {/* Se seu Header precisa de acesso ao carrinho ou auth, deve estar DENTRO dos providers */}
          {/* <Header /> */}
          
          {/* Conteúdo principal */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* <Footer /> */}
        </CombinedProviders>
        <Analytics />
      </body>
    </html>
  )
}
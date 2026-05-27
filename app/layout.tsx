import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Studio Views | Hub Criativo de Conteúdo e Entretenimento",
  description:
    "Studio Views - Seu principal destino para criação de conteúdo inovador, entretenimento digital e parcerias criativas. Explore nosso portfólio de projetos inspiradores.",
  keywords: [
    "Studio Views",
    "criação de conteúdo",
    "entretenimento",
    "mídia digital",
    "serviços criativos",
    "parcerias",
  ],
  generator: "v0.app",
  applicationName: "Studio Views",
  authors: [{ name: "Studio Views" }],
  creator: "Studio Views",
  publisher: "Studio Views",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://studioviews.com.br",
    siteName: "Studio Views",
    title: "Studio Views | Hub Criativo de Conteúdo e Entretenimento",
    description: "Descubra inovação em criação de conteúdo e parcerias de entretenimento digital com a Studio Views.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo Studio Views",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Views | Hub Criativo de Conteúdo e Entretenimento",
    description: "Descubra inovação em criação de conteúdo e parcerias de entretenimento digital com a Studio Views.",
    creator: "@studioviews",
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
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

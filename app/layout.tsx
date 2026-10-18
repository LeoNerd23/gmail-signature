import { Geist_Mono, Manrope, Roboto } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Assinatura Studio | Gerador de assinatura para Gmail",
  description: "Crie e personalize sua assinatura profissional para o Gmail.",
}

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", manrope.variable, robotoHeading.variable)}
    >
      <body>
        {children}
      </body>
    </html>
  )
}

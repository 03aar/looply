import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Looply - Beautiful Forms That People Love to Fill",
  description: "Create stunning, animated forms with an amazing user experience. The modern alternative to Google Forms.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

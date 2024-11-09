import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next BlurHash',
  description: 'Generate DataURLs and Blurhash codes effortlessly, streamlining the way you enhance visuals for your web projects.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <body>
        {children}
      </body>
    </html>
  )
}

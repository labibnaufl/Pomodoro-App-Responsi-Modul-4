
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PomodoroFlow',
  description: 'Pomodoro timer and productivity tracker',
  manifest: '/manifest.json',
  themeColor: '#EF4444',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PomodoroFlow',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
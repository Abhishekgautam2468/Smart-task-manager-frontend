import './globals.css'
import ReduxProvider from '@/redux/ReduxProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}

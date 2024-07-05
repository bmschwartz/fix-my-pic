import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import AppProviders from '@/contexts/AppProviders'
import { Layout } from '@/components/layout'
import '@/styles/global.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
    <AppProviders>
      <main className="text-foreground bg-background">
        {getLayout(<Component {...pageProps} />)}
      </main>
    </AppProviders>
  )
}

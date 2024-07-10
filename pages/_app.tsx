import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import AppProviders from '@/contexts/AppProviders'
import { Layout } from '@/components/layout'
import '@/styles/global.css'
import Head from 'next/head'

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
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <main>{getLayout(<Component {...pageProps} />)}</main>
    </AppProviders>
  )
}

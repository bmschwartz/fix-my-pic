import { CssBaseline, ThemeProvider } from '@mui/material';
import Head from 'next/head';

import AppProviders from '@/contexts/AppContextProviders';
import { WalletProvider } from '@/contexts/WalletContext';
import { MainLayout } from '@/layouts';
import theme from '@/theme';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import '@/styles/globals.css';

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <ThemeProvider theme={theme}>
      <AppProviders>
        <CssBaseline />
        <WalletProvider>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <main>{getLayout(<Component {...pageProps} />)}</main>
        </WalletProvider>
      </AppProviders>
    </ThemeProvider>
  );
}

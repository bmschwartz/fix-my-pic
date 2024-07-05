import React, { ReactNode } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { ImageStoreProvider } from './ImageStoreContext'
import { BountyProvider } from './BountyContext'
import { WalletProvider } from './WalletProvider'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <NextUIProvider>
      <WalletProvider>
        <ImageStoreProvider>
          <BountyProvider>{children}</BountyProvider>
        </ImageStoreProvider>
      </WalletProvider>
    </NextUIProvider>
  )
}

export default AppProviders

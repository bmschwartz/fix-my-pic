import React, { ReactNode } from 'react'
import { ImageStoreProvider } from './ImageStoreContext'
import { WalletProvider } from './WalletProvider'
import { BountyProvider } from './BountyContext'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <WalletProvider>
      <ImageStoreProvider>
        <BountyProvider>{children}</BountyProvider>
      </ImageStoreProvider>
    </WalletProvider>
  )
}

export default AppProviders

import React, { ReactNode, useEffect, useState } from 'react'
import { ImageStoreProvider } from './ImageStoreContext'
import { WalletProvider } from './WalletProvider'
import { BountyProvider } from './BountyContext'
import { getPictureBountyApi, PictureBountyApi } from '@/utils/pictureBountyApi'
import FullScreenLoader from '@/components/loading/FullScreenLoader'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [pictureBountyApi, setPictureBountyApi] = useState<PictureBountyApi>()

  useEffect(() => {
    async function initBountyApi() {
      setPictureBountyApi(await getPictureBountyApi())
    }

    initBountyApi()
  }, [])

  if (!pictureBountyApi) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    ) // or any loading indicator
  }

  return (
    <WalletProvider>
      <ImageStoreProvider>
        <BountyProvider pictureBountyApi={pictureBountyApi}>{children}</BountyProvider>
      </ImageStoreProvider>
    </WalletProvider>
  )
}

export default AppProviders

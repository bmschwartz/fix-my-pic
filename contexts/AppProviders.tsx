import React, { ReactNode, useEffect, useState } from 'react'

import { getPictureBountyApi, PictureBountyApi } from '@/utils/pictureBountyApi'
import FullScreenLoader from '@/components/loading/FullScreenLoader'

import { BountyProvider } from './BountyContext'
import { WalletProvider } from './WalletProvider'
import { EthUsdRateProvider } from './EthRateProvider'
import { SubmissionProvider } from './SubmissionContext'
import { ImageStoreProvider } from './ImageStoreContext'

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
    )
  }

  return (
    <EthUsdRateProvider>
      <WalletProvider>
        <ImageStoreProvider>
          <BountyProvider pictureBountyApi={pictureBountyApi}>
            <SubmissionProvider pictureBountyApi={pictureBountyApi}>{children}</SubmissionProvider>
          </BountyProvider>
        </ImageStoreProvider>
      </WalletProvider>
    </EthUsdRateProvider>
  )
}

export default AppProviders

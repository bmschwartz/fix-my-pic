import React, { ReactNode, useEffect, useState } from 'react'

import { getPictureRequestApi, PictureRequestApi } from '@/utils/pictureRequestApi'
import FullScreenLoader from '@/components/loading/FullScreenLoader'

import { PictureRequestProvider } from './PictureRequestContext'
import { WalletProvider } from './WalletProvider'
import { EthUsdRateProvider } from './EthRateProvider'
import { RequestSubmissionProvider } from './RequestSubmissionContext'
import { ImageStoreProvider } from './ImageStoreContext'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [pictureRequestApi, setPictureRequestApi] = useState<PictureRequestApi>()

  useEffect(() => {
    async function initBountyApi() {
      setPictureRequestApi(await getPictureRequestApi())
    }

    initBountyApi()
  }, [])

  if (!pictureRequestApi) {
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
          <PictureRequestProvider pictureRequestApi={pictureRequestApi}>
            <RequestSubmissionProvider pictureRequestApi={pictureRequestApi}>
              {children}
            </RequestSubmissionProvider>
          </PictureRequestProvider>
        </ImageStoreProvider>
      </WalletProvider>
    </EthUsdRateProvider>
  )
}

export default AppProviders

import React, { ReactNode, useEffect, useState } from 'react'

// import { getPictureBountyApi, PictureBountyApi } from '@/utils/pictureBountyApi'
import { getImageRequestApi, ImageRequestApi } from '@/utils/imageRequestApi'
import FullScreenLoader from '@/components/loading/FullScreenLoader'

import { ImageRequestProvider } from './ImageRequestContext'
// import { BountyProvider } from './BountyContext'
import { WalletProvider } from './WalletProvider'
import { EthUsdRateProvider } from './EthRateProvider'
import { RequestSubmissionProvider } from './RequestSubmissionContext'
// import { SubmissionProvider } from './SubmissionContext'
import { ImageStoreProvider } from './ImageStoreContext'

interface AppProvidersProps {
  children: ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [imageRequestApi, setImageRequestApi] = useState<ImageRequestApi>()

  useEffect(() => {
    async function initBountyApi() {
      setImageRequestApi(await getImageRequestApi())
    }

    initBountyApi()
  }, [])

  if (!imageRequestApi) {
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
          <ImageRequestProvider imageRequestApi={imageRequestApi}>
            <RequestSubmissionProvider imageRequestApi={imageRequestApi}>
              {children}
            </RequestSubmissionProvider>
          </ImageRequestProvider>
        </ImageStoreProvider>
      </WalletProvider>
    </EthUsdRateProvider>
  )
}

export default AppProviders

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Button } from '@mui/material'

import { ImageRequest } from '@/types/imageRequest'
import { useImageRequest } from '@/hooks/useImageRequest'
import { SelectedWallet } from '@/components/wallet'
import FullScreenLoader from '@/components/loading/FullScreenLoader'
import { SubmissionList } from '@/components/requestSubmission/SubmissionList'
import { ImageRequestDetailInfo } from '@/components/imageRequest/ImageRequestDetailInfo'

const RequestDetailPage: React.FC = () => {
  const router = useRouter()
  const { address } = router.query
  const { getImageRequest } = useImageRequest()
  const [imageRequest, setImageRequest] = useState<ImageRequest>()

  useEffect(() => {
    async function _initImageRequest() {
      const _imageRequest = (await getImageRequest(address as string)) as ImageRequest
      setImageRequest(_imageRequest)
    }
    _initImageRequest()
  }, [address])

  if (!imageRequest) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    )
  }

  return (
    <Container>
      <SelectedWallet />
      <Box mt={4} mb={4}>
        <Button variant="contained" color="primary" onClick={() => router.back()}>
          Back
        </Button>
      </Box>
      <Box mt={4} mb={4}>
        <ImageRequestDetailInfo imageRequest={imageRequest} />
      </Box>
      <Box mt={4} mb={4}>
        <SubmissionList imageRequest={imageRequest} />
      </Box>
    </Container>
  )
}

export default RequestDetailPage

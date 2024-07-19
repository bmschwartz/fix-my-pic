import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Button } from '@mui/material'

import { PictureRequest } from '@/types/pictureRequest'
import { usePictureRequest } from '@/hooks/usePictureRequest'
import { SelectedWallet } from '@/components/wallet'
import FullScreenLoader from '@/components/loading/FullScreenLoader'
import { SubmissionList } from '@/components/submission/SubmissionList'
import { PictureRequestDetail } from '@/components/request'

const RequestDetailPage: React.FC = () => {
  const router = useRouter()
  const { address } = router.query
  const { getPictureRequest } = usePictureRequest()
  const [pictureRequest, setPictureRequest] = useState<PictureRequest>()

  useEffect(() => {
    async function _initPictureRequest() {
      const _pictureRequest = (await getPictureRequest(address as string)) as PictureRequest
      setPictureRequest(_pictureRequest)
    }
    _initPictureRequest()
  }, [address])

  if (!pictureRequest) {
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
        <Button variant="contained" color="primary" onClick={() => router.push('/')}>
          Back
        </Button>
      </Box>
      <Box mt={4} mb={4}>
        <PictureRequestDetail pictureRequest={pictureRequest} />
      </Box>
      <Box mt={4} mb={4}>
        <SubmissionList pictureRequest={pictureRequest} />
      </Box>
    </Container>
  )
}

export default RequestDetailPage

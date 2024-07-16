import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Button } from '@mui/material'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'
import FullScreenLoader from '@/components/loading/FullScreenLoader'
import { BountyDetailInfo } from '@/components/bounty/BountyDetailInfo'
import { SubmissionList } from '@/components/submission/SubmissionList'
import { SelectedWallet } from '@/components/wallet'

const BountyDetailPage: React.FC = () => {
  const router = useRouter()
  const { address } = router.query
  const { getPictureBounty } = useBounty()
  const [bounty, setBounty] = useState<Bounty>()

  useEffect(() => {
    async function initBounty() {
      const _bounty = (await getPictureBounty(address as string)) as Bounty
      setBounty(_bounty)
    }
    initBounty()
  }, [address])

  if (!bounty) {
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
        <BountyDetailInfo bounty={bounty} />
      </Box>
      <Box mt={4} mb={4}>
        <SubmissionList bounty={bounty} />
      </Box>
    </Container>
  )
}

export default BountyDetailPage

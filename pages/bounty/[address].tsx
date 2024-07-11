import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Grid, Typography, Box, Button, Paper } from '@mui/material'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'
import FullScreenLoader from '@/components/loading/FullScreenLoader'
import { BountySubmissionList } from '@/components/bounty/BountySubmissionList'

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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `https://ipfs.io/ipfs/${bounty.imageId}`
    link.download = `${bounty.title}.jpg`
    link.click()
  }

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Button variant="contained" color="primary" onClick={() => router.back()}>
          Back
        </Button>
      </Box>
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12}>
              <img
                src={`https://ipfs.io/ipfs/${bounty.imageId}`}
                alt={bounty.title}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {bounty.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {bounty.description}
              </Typography>
              <Typography variant="h6">Reward: {bounty.reward}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownload}
                style={{ marginTop: '16px' }}
              >
                Download Image
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Box mt={4}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Submissions</Typography>
            <Button variant="contained" color="primary">
              Submit Picture
            </Button>
          </Grid>
          <BountySubmissionList bounty={bounty} />
        </Paper>
      </Box>
    </Container>
  )
}

export default BountyDetailPage

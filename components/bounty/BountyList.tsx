'use client'

import React from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Container } from '@mui/material'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'

const IMAGE_URL_ROOT = process.env.NEXT_PUBLIC_PINATA_GATEWAY || ''

if (!IMAGE_URL_ROOT) {
  throw new Error('IMAGE_URL_ROOT not set!')
}

const BountyCard = ({ bounty }: { bounty: Bounty }) => (
  <Card>
    <CardMedia
      component="img"
      src={`https://ipfs.io/ipfs/${bounty.imageId}`}
      // src={`${IMAGE_URL_ROOT}/${bounty.imageId}`}
      alt={bounty.title}
      style={{ height: '66%' }}
    />
    <CardContent style={{ height: '34%' }}>
      <Typography variant="h6">{bounty.title}</Typography>
      <Typography variant="body2">{bounty.reward}</Typography>
    </CardContent>
  </Card>
)

export const BountyList = () => {
  const { bounties } = useBounty()

  return (
    <Container>
      <Grid container spacing={2}>
        {bounties.map((bounty) => (
          <Grid item xs={12} sm={6} md={4} key={bounty.address}>
            <BountyCard bounty={bounty} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

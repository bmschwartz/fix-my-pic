'use client'

import React from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, Container, Paper } from '@mui/material'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'

const BountyCard = ({ bounty }: { bounty: Bounty }) => (
  <Paper elevation={3} style={{ margin: '16px' }}>
    <Card>
      <CardMedia
        component="img"
        src={`https://ipfs.io/ipfs/${bounty.imageId}`}
        alt={bounty.title}
        style={{ height: '200px' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {bounty.title}
        </Typography>
        <Typography variant="body2">Reward: {bounty.reward}</Typography>
      </CardContent>
    </Card>
  </Paper>
)

export const BountyList = () => {
  const { bounties } = useBounty()

  return (
    <Container>
      <Grid container spacing={3}>
        {bounties.map((bounty) => (
          <Grid item xs={12} sm={6} md={4} key={bounty.address}>
            <BountyCard bounty={bounty} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

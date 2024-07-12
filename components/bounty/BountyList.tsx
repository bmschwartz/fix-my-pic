'use client'

import React from 'react'
import Link from 'next/link'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Paper,
  IconButton,
  Box,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'

const BountyCard = ({ bounty }: { bounty: Bounty }) => {
  return (
    <Link href={`/bounty/${bounty.address}`} passHref>
      <Paper elevation={3} style={{ margin: '16px', cursor: 'pointer' }}>
        <Card>
          <CardMedia
            component="img"
            src={`https://ipfs.io/ipfs/${bounty.imageId}`}
            alt={bounty.title}
            style={{ height: '200px' }}
          />
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                {bounty.title}
              </Typography>
              <Typography variant="body2">Reward: {bounty.reward}</Typography>
            </Box>
            <IconButton size="large">
              <ChevronRightIcon />
            </IconButton>
          </CardContent>
        </Card>
      </Paper>
    </Link>
  )
}

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

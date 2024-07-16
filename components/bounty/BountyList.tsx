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
  Skeleton,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { Bounty } from '@/types/bounty'
import { useBounty } from '@/hooks/useBounty'
import { rewardDisplayString } from '@/utils/bounty'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'

const BountyCard = ({ bounty, ethToUsdRate }: { bounty: Bounty; ethToUsdRate: number }) => {
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
              <Typography variant="body2">
                Reward: {rewardDisplayString(bounty, ethToUsdRate)}
              </Typography>
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
  const { ethToUsdRate } = useEthUsdRate()

  return (
    <Container>
      <Grid container spacing={3}>
        {bounties.map((bounty) => (
          <Grid item xs={12} sm={6} md={4} key={bounty.address}>
            {ethToUsdRate === undefined ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : (
              <BountyCard bounty={bounty} ethToUsdRate={ethToUsdRate} />
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

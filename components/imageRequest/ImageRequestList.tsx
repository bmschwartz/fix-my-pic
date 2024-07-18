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

import { ImageRequest } from '@/types/imageRequest'
import { useImageRequest } from '@/hooks/useImageRequest'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { ethDisplayWithUSDString } from '@/utils/currency'

const ImageRequestCard = ({
  imageRequest,
  ethToUsdRate,
}: {
  imageRequest: ImageRequest
  ethToUsdRate: number
}) => {
  return (
    <Link href={`/request/${imageRequest.address}`} passHref>
      <Paper elevation={3} style={{ margin: '16px', cursor: 'pointer' }}>
        <Card>
          <CardMedia
            component="img"
            src={imageRequest.imageUrl}
            alt={imageRequest.title}
            style={{ height: '200px' }}
          />
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                {imageRequest.title}
              </Typography>
              <Typography variant="body2">
                Budget: {ethDisplayWithUSDString(imageRequest.budget, ethToUsdRate)}
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

export const ImageRequestList = () => {
  const { imageRequests } = useImageRequest()
  const { ethToUsdRate } = useEthUsdRate()

  return (
    <Container>
      <Grid container spacing={3}>
        {imageRequests.map((imageRequest: ImageRequest) => (
          <Grid item xs={12} sm={6} md={4} key={imageRequest.address}>
            {ethToUsdRate === undefined ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : (
              <ImageRequestCard imageRequest={imageRequest} ethToUsdRate={ethToUsdRate} />
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

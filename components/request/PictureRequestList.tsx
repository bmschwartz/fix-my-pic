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

import { PictureRequest } from '@/types/pictureRequest'
import { usePictureRequest } from '@/hooks/usePictureRequest'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { ethDisplayWithUSDString } from '@/utils/currency'

const PictureRequestCard = ({
  pictureRequest,
  ethToUsdRate,
}: {
  pictureRequest: PictureRequest
  ethToUsdRate: number
}) => {
  return (
    <Link href={`/request/${pictureRequest.address}`} passHref>
      <Paper elevation={3} style={{ margin: '16px', cursor: 'pointer' }}>
        <Card>
          <CardMedia
            component="img"
            src={pictureRequest.imageUrl}
            alt={pictureRequest.title}
            style={{ height: '200px' }}
          />
          <CardContent
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                {pictureRequest.title}
              </Typography>
              <Typography variant="body2">
                {pictureRequest.budget !== undefined
                  ? `Budget: ${ethDisplayWithUSDString(pictureRequest.budget, ethToUsdRate)}`
                  : ''}
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

export const PictureRequestList = () => {
  const { pictureRequests } = usePictureRequest()
  const { ethToUsdRate } = useEthUsdRate()

  return (
    <Container>
      <Grid container spacing={3}>
        {pictureRequests.map((pictureRequest: PictureRequest) => (
          <Grid item xs={12} sm={6} md={4} key={pictureRequest.address}>
            {ethToUsdRate === undefined ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : (
              <PictureRequestCard pictureRequest={pictureRequest} ethToUsdRate={ethToUsdRate} />
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

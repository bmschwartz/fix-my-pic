'use client'

import React from 'react'
import Link from 'next/link'
import {
  ImageList,
  ImageListItem,
  Paper,
  IconButton,
  Box,
  Typography,
  Container,
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
      <Paper elevation={3} style={{ margin: '8px', cursor: 'pointer' }}>
        <ImageListItem key={pictureRequest.imageUrl}>
          <img
            srcSet={`${pictureRequest.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${pictureRequest.imageUrl}?w=248&fit=crop&auto=format`}
            alt={pictureRequest.title}
            loading="lazy"
          />
          {/* <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
            }}
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
          </Box> */}
        </ImageListItem>
      </Paper>
    </Link>
  )
}

export const PictureRequestList = () => {
  const { pictureRequests } = usePictureRequest()
  const { ethToUsdRate } = useEthUsdRate()

  return (
    <Container>
      <ImageList variant="masonry" cols={3} gap={8}>
        {pictureRequests.map((pictureRequest: PictureRequest) =>
          ethToUsdRate === undefined ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              key={pictureRequest.address}
            />
          ) : (
            <PictureRequestCard
              pictureRequest={pictureRequest}
              ethToUsdRate={ethToUsdRate}
              key={pictureRequest.address}
            />
          )
        )}
      </ImageList>
    </Container>
  )
}

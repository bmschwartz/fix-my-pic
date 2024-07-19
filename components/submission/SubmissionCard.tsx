import React, { useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import { PictureRequestSubmission } from '@/types/submission'
import ConfirmationDialog from './PurchaseConfirmationDialog'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { ethDisplayWithUSDString } from '@/utils/currency'

interface SubmissionCardProps {
  submission: PictureRequestSubmission

  onClick: () => void
  onPurchase: (address: string) => Promise<void>
}

const SubmissionCard = ({ submission, onClick, onPurchase }: SubmissionCardProps) => {
  const [open, setOpen] = useState(false)
  const { ethToUsdRate } = useEthUsdRate()

  const handleClickOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} key={submission.address}>
        <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
          <CardMedia component="img" src={submission.imageUrl} style={{ height: '200px' }} />
          <CardContent>
            <Typography variant="body2">{submission.description}</Typography>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button size="small" color="primary" variant="contained" onClick={handleClickOpen}>
              {submission?.price === 0
                ? 'Download Free'
                : `Purchase ${ethToUsdRate && submission?.price !== undefined ? ethDisplayWithUSDString(submission?.price, ethToUsdRate) : ''}`}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <ConfirmationDialog
        open={open}
        handleClose={handleClickClose}
        submission={submission}
        onPurchase={onPurchase}
      />
    </>
  )
}

export default SubmissionCard

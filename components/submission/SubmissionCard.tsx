import React, { useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import { PictureRequestSubmission } from '@/types/submission'
import ConfirmationDialog from './PurchaseConfirmationDialog'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { ethDisplayWithUSDString } from '@/utils/currency'
import { usePurchases } from '@/hooks/usePurchases'

interface SubmissionCardProps {
  imageUrl: string
  submission: PictureRequestSubmission

  onClick: () => void
  onPurchase: (address: string) => Promise<void>
}

const SubmissionCard = ({ submission, imageUrl, onClick, onPurchase }: SubmissionCardProps) => {
  const { ethToUsdRate } = useEthUsdRate()
  const { getPurchaseForSubmission } = usePurchases()
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const submissionPurchased = Boolean(getPurchaseForSubmission(submission.address))

  let purchaseButtonText: string
  if (submissionPurchased || submission?.price === 0) {
    purchaseButtonText = 'Download'
  } else {
    purchaseButtonText = `Purchase ${ethToUsdRate && submission?.price !== undefined ? ethDisplayWithUSDString(submission?.price, ethToUsdRate) : ''}`
  }

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (submissionPurchased || submission.price === 0) {
      handleDownload()
    } else {
      setConfirmationOpen(true)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.target = '_blank'
    link.download = `${submission.address}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClickClose = () => {
    setConfirmationOpen(false)
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} key={submission.address}>
        <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
          <CardMedia component="img" src={imageUrl} style={{ height: '200px' }} />
          <CardContent>
            <Typography variant="body2">{submission.description}</Typography>
          </CardContent>
          <CardActions style={{ justifyContent: 'center' }}>
            <Button size="small" color="primary" variant="contained" onClick={handlePurchaseClick}>
              {purchaseButtonText}
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <ConfirmationDialog
        open={confirmationOpen}
        handleClose={handleClickClose}
        submission={submission}
        imageUrl={imageUrl}
        onPurchase={onPurchase}
      />
    </>
  )
}

export default SubmissionCard

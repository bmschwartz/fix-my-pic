import React, { useState } from 'react'
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import { BountySubmission } from '@/types/submission'
import { ChooseWinnerConfirmation } from './ChooseWinnerConfirmation'

interface SubmissionCardProps {
  submission: BountySubmission
  displayChooseWinner: boolean
  onChooseWinner: (address: string) => Promise<void>
  onClick: () => void
}

const SubmissionCard = ({
  submission,
  displayChooseWinner,
  onChooseWinner,
  onClick,
}: SubmissionCardProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClickOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    setLoading(true)
    await onChooseWinner(submission.address)
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} key={submission.address}>
        <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
          <CardMedia
            component="img"
            src={`https://ipfs.io/ipfs/${submission.imageId}`}
            style={{ height: '200px' }}
          />
          <CardContent>
            <Typography variant="body2">{submission.description}</Typography>
          </CardContent>
          {displayChooseWinner && (
            <CardActions style={{ justifyContent: 'center' }}>
              <Button size="small" color="primary" variant="contained" onClick={handleClickOpen}>
                Choose Winner
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>
      {displayChooseWinner && (
        <ChooseWinnerConfirmation
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          open={open}
          loading={loading}
          imageURL={`https://ipfs.io/ipfs/${submission.imageId}`}
        />
      )}
    </>
  )
}

export default SubmissionCard

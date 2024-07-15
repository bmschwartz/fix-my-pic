import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { BountySubmission } from '@/types/submission'

interface SubmissionCardProps {
  submission: BountySubmission
  isBountyOwner: boolean
  onChooseWinner: (address: string) => Promise<void>
}

const SubmissionCard = ({ submission, isBountyOwner, onChooseWinner }: SubmissionCardProps) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    await onChooseWinner(submission.address)
    handleClose()
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4} key={submission.address}>
        <Card>
          <CardMedia
            component="img"
            src={`https://ipfs.io/ipfs/${submission.imageId}`}
            style={{ height: '200px' }}
          />
          <CardContent>
            <Typography variant="body2">{submission.description}</Typography>
          </CardContent>
          {isBountyOwner && (
            <CardActions style={{ justifyContent: 'center' }}>
              <Button size="small" color="primary" variant="contained" onClick={handleClickOpen}>
                Choose Winner
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>
      {isBountyOwner && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Confirm Winner</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to choose this submission as the winner?
            </DialogContentText>
            <CardMedia
              component="img"
              src={`https://ipfs.io/ipfs/${submission.imageId}`}
              style={{ width: '100%', height: 'auto' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default SubmissionCard

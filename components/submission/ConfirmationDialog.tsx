import { BountySubmission } from '@/types/submission'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useState } from 'react'

interface ConfirmationDialogProps {
  open: boolean
  submission: BountySubmission

  handleClose: () => void
  onChooseWinner: (address: string) => Promise<void>
}

const ConfirmationDialog = ({
  open,
  handleClose,
  submission,
  onChooseWinner,
}: ConfirmationDialogProps) => {
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const handleConfirm = async () => {
    setLoadingConfirm(true)
    await onChooseWinner(submission.address)
    setLoadingConfirm(false)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          Are you sure you want to choose this submission as the winner?
        </Typography>
        <img
          src={`https://ipfs.io/ipfs/${submission.imageId}`}
          alt={submission.description}
          style={{ maxHeight: '80vh', maxWidth: '100%', marginTop: '20px' }}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={loadingConfirm}
        >
          {loadingConfirm ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog

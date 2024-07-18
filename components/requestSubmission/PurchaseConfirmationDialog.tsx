import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material'
import { ImageRequestSubmission } from '@/types/submission'
import { ethDisplayString, ethDisplayWithUSDString } from '@/utils/currency'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'

interface ConfirmationDialogProps {
  open: boolean
  submission: ImageRequestSubmission

  handleClose: () => void
  onPurchase: (address: string) => Promise<void>
}

const ConfirmationDialog = ({
  open,
  handleClose,
  submission,
  onPurchase,
}: ConfirmationDialogProps) => {
  const { ethToUsdRate } = useEthUsdRate()
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const handleConfirm = async () => {
    setLoadingConfirm(true)
    await onPurchase(submission.address)
    setLoadingConfirm(false)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          {`Are you sure you want to purchase this submission for ${ethToUsdRate ? ethDisplayWithUSDString(submission.price, ethToUsdRate) : ethDisplayString(submission.price)}?`}
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

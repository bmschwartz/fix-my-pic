import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { PictureRequestSubmission } from '@/types/submission'
import { ethDisplayString, ethDisplayWithUSDString } from '@/utils/currency'
import { useImageStore } from '@/hooks/useImageStore'

interface ConfirmationDialogProps {
  open: boolean
  imageUrl: string | undefined
  submission: PictureRequestSubmission

  handleClose: () => void
  onPurchase: (address: string) => Promise<void>
}

const ConfirmationDialog = ({
  open,
  imageUrl,
  submission,
  onPurchase,
  handleClose,
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
        {submission.price !== 0 && (
          <Typography variant="h6">
            {`Are you sure you want to purchase this picture for ${ethToUsdRate && submission.price !== undefined ? ethDisplayWithUSDString(submission.price, ethToUsdRate) : ethDisplayString(submission.price)}?`}
          </Typography>
        )}
        <img
          src={imageUrl}
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
          {loadingConfirm ? (
            <CircularProgress size={24} />
          ) : submission.price === 0 ? (
            'Download'
          ) : (
            'Confirm'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog

import {
  Backdrop,
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface ChooseWinnerConfirmationProps {
  open: boolean
  loading: boolean
  imageURL: string
  handleClose: () => void
  handleConfirm: () => void
}
export const ChooseWinnerConfirmation = ({
  open,
  loading,
  imageURL,
  handleClose,
  handleConfirm,
}: ChooseWinnerConfirmationProps) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Confirm Winner</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to choose this submission as the winner?
        </DialogContentText>
        <CardMedia component="img" src={imageURL} style={{ width: '100%', height: 'auto' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={loading}>
          Confirm
        </Button>
      </DialogActions>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  )
}

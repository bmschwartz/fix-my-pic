import { Dialog, DialogContent, DialogActions, IconButton, Box, Button } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { PictureRequestSubmission } from '@/types/submission'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { ethDisplayWithUSDString } from '@/utils/currency'
import { useEthUsdRate } from '@/hooks/useEthUsdRate'

interface SlideshowDialogProps {
  open: boolean
  currentSlide: number
  submissions: PictureRequestSubmission[]

  handleClose: () => void
  setCurrentSlide: Dispatch<SetStateAction<number>>
  setConfirmDialogOpen: Dispatch<SetStateAction<boolean>>
}

const SlideshowDialog = ({
  open,
  submissions,
  currentSlide,
  setCurrentSlide,
  handleClose,
  setConfirmDialogOpen,
}: SlideshowDialogProps) => {
  const { ethToUsdRate } = useEthUsdRate()
  const submission = submissions[currentSlide]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousSlide()
      } else if (event.key === 'ArrowRight') {
        handleNextSlide()
      }
    }

    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? submissions.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === submissions.length - 1 ? 0 : prev + 1))
  }

  const renderThumbnails = () => {
    const startIndex = Math.max(0, currentSlide - 1)
    const endIndex = Math.min(submissions.length, startIndex + 4)

    return (
      <Box display="flex" justifyContent="center" mt={2}>
        {submissions.slice(startIndex, endIndex).map((submission, index) => (
          <Box
            key={submission.address}
            onClick={() => setCurrentSlide(startIndex + index)}
            sx={{
              border:
                currentSlide === startIndex + index ? '2px solid white' : '2px solid transparent',
              cursor: 'pointer',
              margin: '0 4px',
              '& img': { height: 50, width: 50, objectFit: 'cover' },
            }}
          >
            <img src={submission.imageUrl} alt={submission.description} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { backgroundColor: '#f5f5f5', color: 'black' } }}
    >
      <DialogContent style={{ textAlign: 'center', position: 'relative' }}>
        <img
          src={submission?.imageUrl}
          alt={submission?.description}
          style={{ maxHeight: '80vh', maxWidth: '100%' }}
        />
        {renderThumbnails()}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        <IconButton onClick={handlePreviousSlide} style={{ color: 'black' }}>
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={handleNextSlide} style={{ color: 'black' }}>
          <ArrowForwardIos />
        </IconButton>
      </DialogActions>
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Button variant="contained" color="primary" onClick={() => setConfirmDialogOpen(true)}>
          {submission?.price === 0
            ? 'Download Free'
            : `Purchase ${ethToUsdRate && submission?.price !== undefined ? ethDisplayWithUSDString(submission?.price, ethToUsdRate) : ''}`}
        </Button>
      </Box>
    </Dialog>
  )
}

export default SlideshowDialog

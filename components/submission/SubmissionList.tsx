import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from '@mui/material'
import { Bounty, BountyState } from '@/types/bounty'
import { BountySubmission } from '@/types/submission'
import Link from 'next/link'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useCallback, useEffect, useState } from 'react'
import SubmissionCard from './SubmissionCard'
import { useBounty } from '@/hooks/useBounty'
import { useWallet } from '@/hooks/useWallet'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

export const SubmissionList = ({ bounty }: { bounty: Bounty }) => {
  const { getBountySubmissions } = useSubmissions()
  const { selectedWallet, selectedAccount } = useWallet()
  const { payOutReward } = useBounty()
  const [submissions, setSubmissions] = useState<BountySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [openSlideshow, setOpenSlideshow] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const isBountyOwner = selectedAccount?.toLowerCase() == bounty.owner.toLowerCase()
  const isActiveBounty = Number(bounty.state) === BountyState.ACTIVE
  const displayChooseWinner = isBountyOwner && isActiveBounty
  const displaySubmitEdit = selectedWallet && selectedAccount && isActiveBounty

  useEffect(() => {
    const getSubmissions = async () => {
      setLoading(true)

      try {
        const data = await getBountySubmissions(bounty.address)
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching submissions', err)
      } finally {
        setLoading(false)
      }
    }

    getSubmissions()
  }, [bounty.address, getBountySubmissions])

  const handleOpenSlideshow = (index: number) => {
    setCurrentSlide(index)
    setOpenSlideshow(true)
  }

  const handleCloseSlideshow = () => {
    setOpenSlideshow(false)
  }

  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? submissions.length - 1 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === submissions.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousSlide()
      } else if (event.key === 'ArrowRight') {
        handleNextSlide()
      }
    }

    if (openSlideshow) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openSlideshow])

  const onChooseWinner = useCallback(async (submissionAddress: string): Promise<void> => {
    await payOutReward(bounty.address, submissionAddress)
  }, [])

  const handleConfirmOpen = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false)
  }

  const handleConfirm = async () => {
    setLoadingConfirm(true)
    await onChooseWinner(submissions[currentSlide].address)
    setLoadingConfirm(false)
    handleConfirmClose()
    handleCloseSlideshow()
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
              '& img': {
                height: 50,
                width: 50,
                objectFit: 'cover',
              },
            }}
          >
            <img src={`https://ipfs.io/ipfs/${submission.imageId}`} alt={submission.description} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Submissions</Typography>
        {displaySubmitEdit && (
          <Link href={`/submission/new?bountyAddress=${bounty.address}`} passHref>
            <Button variant="contained" color="primary">
              Submit Edit
            </Button>
          </Link>
        )}
      </Grid>
      <Grid container spacing={3} mt={2}>
        {loading ? (
          <Grid item xs={12} mt={5} mb={5} style={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : submissions.length === 0 ? (
          <Grid item xs={12} mt={5} mb={5} style={{ textAlign: 'center' }}>
            <Typography variant="h6">No edits have been submitted yet</Typography>
          </Grid>
        ) : (
          submissions.map((submission: BountySubmission, index: number) => (
            <SubmissionCard
              key={submission.address}
              submission={submission}
              displayChooseWinner={displayChooseWinner}
              onChooseWinner={onChooseWinner}
              onClick={() => handleOpenSlideshow(index)}
            />
          ))
        )}
      </Grid>

      <Dialog
        open={openSlideshow}
        onClose={handleCloseSlideshow}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: '#f5f5f5',
            color: 'black',
          },
        }}
      >
        <DialogContent style={{ textAlign: 'center', position: 'relative' }}>
          <img
            src={`https://ipfs.io/ipfs/${submissions[currentSlide]?.imageId}`}
            alt={submissions[currentSlide]?.description}
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
        {displayChooseWinner && (
          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <Button variant="contained" color="primary" onClick={handleConfirmOpen}>
              Choose Winner
            </Button>
          </Box>
        )}
      </Dialog>

      {displayChooseWinner && (
        <Dialog open={confirmDialogOpen} onClose={handleConfirmClose} fullWidth maxWidth="sm">
          <DialogContent style={{ textAlign: 'center' }}>
            <Typography variant="h6">
              Are you sure you want to choose this submission as the winner?
            </Typography>
            <img
              src={`https://ipfs.io/ipfs/${submissions[currentSlide]?.imageId}`}
              alt={submissions[currentSlide]?.description}
              style={{ maxHeight: '80vh', maxWidth: '100%', marginTop: '20px' }}
            />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleConfirmClose}>
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
      )}
    </Paper>
  )
}

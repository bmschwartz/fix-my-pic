import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

import { useWallet } from '@/hooks/useWallet'
import { useRequestSubmissions } from '@/hooks/useSubmissions'
import { ImageRequestSubmission } from '@/types/submission'
import { ImageRequest } from '@/types/imageRequest'

import SubmissionCard from './SubmissionCard'
import SlideshowDialog from './SlideshowDialog'
import ConfirmationDialog from './PurchaseConfirmationDialog'

export const SubmissionList = ({ imageRequest }: { imageRequest: ImageRequest }) => {
  const { getRequestSubmissions } = useRequestSubmissions()
  const { selectedWallet, selectedAccount } = useWallet()
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openSlideshow, setOpenSlideshow] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [submissions, setSubmissions] = useState<ImageRequestSubmission[]>([])

  const displaySubmitEdit = selectedWallet && selectedAccount

  useEffect(() => {
    const getSubmissions = async () => {
      setLoading(true)
      try {
        const data = await getRequestSubmissions(imageRequest.address)
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching submissions', err)
      } finally {
        setLoading(false)
      }
    }

    getSubmissions()
  }, [imageRequest.address, getRequestSubmissions])

  const onPurchase = useCallback(async (submissionAddress: string): Promise<void> => {
    // await payOutReward(imageRequest.address, submissionAddress)
    console.log('DEBUG purchasing', submissionAddress)
  }, [])

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Submissions</Typography>
        {displaySubmitEdit && (
          <Link href={`/submission/new?request=${imageRequest.address}`} passHref>
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
          submissions.map((submission: ImageRequestSubmission) => (
            <SubmissionCard
              key={submission.address}
              submission={submission}
              onClick={() => setOpenSlideshow(true)}
              onPurchase={onPurchase}
            />
          ))
        )}
      </Grid>

      <SlideshowDialog
        open={openSlideshow}
        submissions={submissions}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        handleClose={() => setOpenSlideshow(false)}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />

      {submissions[currentSlide] && (
        <ConfirmationDialog
          open={confirmDialogOpen}
          handleClose={() => setConfirmDialogOpen(false)}
          submission={submissions[currentSlide]}
          onPurchase={onPurchase}
        />
      )}
    </Paper>
  )
}

export default SubmissionList

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

import { useWallet } from '@/hooks/useWallet'
import { useRequestSubmissions } from '@/hooks/useRequestSubmissions'
import { PictureRequestSubmission } from '@/types/submission'
import { PictureRequest } from '@/types/pictureRequest'

import SubmissionCard from './SubmissionCard'
import SlideshowDialog from './SlideshowDialog'
import ConfirmationDialog from './PurchaseConfirmationDialog'

export const SubmissionList = ({ pictureRequest }: { pictureRequest: PictureRequest }) => {
  const { getRequestSubmissions, purchaseSubmission } = useRequestSubmissions()
  const { selectedWallet, selectedAccount } = useWallet()
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openSlideshow, setOpenSlideshow] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [submissions, setSubmissions] = useState<PictureRequestSubmission[]>([])

  const displaySubmitEdit = selectedWallet && selectedAccount

  useEffect(() => {
    const getSubmissions = async () => {
      setLoading(true)
      try {
        const data = await getRequestSubmissions(pictureRequest.address)
        setSubmissions(data)
      } catch (err) {
        console.error('Error fetching submissions', err)
      } finally {
        setLoading(false)
      }
    }

    getSubmissions()
  }, [pictureRequest.address, getRequestSubmissions])

  const onPurchase = useCallback(async (submissionAddress: string): Promise<void> => {
    console.log('Purchasing', submissionAddress)
    const nftId = await purchaseSubmission(submissionAddress)
    console.log('Completed purchase and received nft', nftId)
  }, [])

  const onClickSubmissionCard = useCallback((index: number) => {
    setCurrentSlide(index)
    setOpenSlideshow(true)
  }, [])

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Submissions</Typography>
        {displaySubmitEdit && (
          <Link href={`/submission/new?request=${pictureRequest.address}`} passHref>
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
          submissions.map((submission: PictureRequestSubmission, index: number) => (
            <SubmissionCard
              key={submission.address}
              submission={submission}
              onClick={() => onClickSubmissionCard(index)}
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

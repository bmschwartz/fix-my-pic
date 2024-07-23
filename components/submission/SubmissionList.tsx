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
import { usePurchases } from '@/hooks/usePurchases'
import { useImageStore } from '@/hooks/useImageStore'
import { SubmissionPurchase } from '@/types/purchase'

export const SubmissionList = ({ pictureRequest }: { pictureRequest: PictureRequest }) => {
  const { selectedWallet, selectedAccount } = useWallet()
  const { getRequestSubmissions } = useRequestSubmissions()
  const { getFreeImageUrl, getDecryptedImageUrl } = useImageStore()
  const { purchasesBySubmission, purchaseSubmission } = usePurchases()

  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openSlideshow, setOpenSlideshow] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [submissions, setSubmissions] = useState<PictureRequestSubmission[]>([])
  const [submissionImageUrls, setSubmissionImageUrls] = useState<Record<string, string>>({})

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

  const _refreshSubmissionImageUrls = async (submissionAddresses?: string[]) => {
    const submissionsToFetch = submissionAddresses
      ? submissions.filter((s) => submissionAddresses.includes(s.address))
      : submissions

    console.log('DEBUG _refreshSubmissions toFetch', submissionsToFetch)

    const imageUrlPromises = submissionsToFetch.map(async (submission) => {
      console.log(
        'DEBUG imageUrlPromises',
        submission.address,
        purchasesBySubmission[submission.address]
      )
      const url = purchasesBySubmission[submission.address]
        ? await getDecryptedImageUrl(submission)
        : Promise.resolve(getFreeImageUrl(submission))

      return {
        address: submission.address,
        url: await url,
      }
    })

    const urlResults = await Promise.all(imageUrlPromises)

    const imageUrls: { [key: string]: string } = {}
    urlResults.forEach((result) => {
      imageUrls[result.address] = result.url
    })

    setSubmissionImageUrls((current) => ({
      ...current,
      ...imageUrls,
    }))
  }

  useEffect(() => {
    const getSubmissionImageUrls = async () => {
      await _refreshSubmissionImageUrls()
    }
    if (submissions.length > 0) {
      getSubmissionImageUrls()
    }
  }, [submissions, pictureRequest.address, purchasesBySubmission, selectedAccount])

  const onPurchase = useCallback(async (submissionAddress: string): Promise<void> => {
    console.log('DEBUG Purchasing submission')
    try {
      const purchase = await purchaseSubmission(submissionAddress)
      console.log('DEBUG onPurchase result', purchase)
      await _refreshSubmissionImageUrls([submissionAddress])
    } catch (e) {
      console.error('DEBUG Error purchasing the submission')
    }
  }, [])

  const onClickSubmissionCard = useCallback((index: number) => {
    setCurrentSlide(index)
    setOpenSlideshow(true)
  }, [])

  const getSubmissionImageUrl = useCallback(
    (submission?: PictureRequestSubmission): string | undefined => {
      return submission ? submissionImageUrls[submission.address] : undefined
    },
    [submissionImageUrls]
  )

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
              imageUrl={submissionImageUrls[submission.address]}
              submission={submission}
              onClick={() => onClickSubmissionCard(index)}
              onPurchase={onPurchase}
            />
          ))
        )}
      </Grid>

      <SlideshowDialog
        open={openSlideshow}
        imageUrl={getSubmissionImageUrl(submissions[currentSlide])}
        submissions={submissions}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        handleClose={() => setOpenSlideshow(false)}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />

      {submissions[currentSlide] && (
        <ConfirmationDialog
          open={confirmDialogOpen}
          imageUrl={getSubmissionImageUrl(submissions[currentSlide])}
          handleClose={() => setConfirmDialogOpen(false)}
          submission={submissions[currentSlide]}
          onPurchase={onPurchase}
        />
      )}
    </Paper>
  )
}

export default SubmissionList

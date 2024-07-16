import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

import { useWallet } from '@/hooks/useWallet'
import { useBounty } from '@/hooks/useBounty'
import { useSubmissions } from '@/hooks/useSubmissions'
import { BountySubmission } from '@/types/submission'
import { Bounty, BountyState } from '@/types/bounty'

import SubmissionCard from './SubmissionCard'
import SlideshowDialog from './SlideshowDialog'
import ConfirmationDialog from './ConfirmationDialog'

export const SubmissionList = ({ bounty }: { bounty: Bounty }) => {
  const { payOutReward } = useBounty()
  const { getBountySubmissions } = useSubmissions()
  const { selectedWallet, selectedAccount } = useWallet()
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openSlideshow, setOpenSlideshow] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [submissions, setSubmissions] = useState<BountySubmission[]>([])

  const isBountyOwner = selectedAccount?.toLowerCase() === bounty.owner.toLowerCase()
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

  const onChooseWinner = useCallback(async (submissionAddress: string): Promise<void> => {
    await payOutReward(bounty.address, submissionAddress)
  }, [])

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
          submissions.map((submission: BountySubmission) => (
            <SubmissionCard
              key={submission.address}
              submission={submission}
              displayChooseWinner={displayChooseWinner}
              onClick={() => setOpenSlideshow(true)}
              onChooseWinner={onChooseWinner}
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
        displayChooseWinner={displayChooseWinner}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />

      {currentSlide && (
        <ConfirmationDialog
          open={confirmDialogOpen}
          handleClose={() => setConfirmDialogOpen(false)}
          submission={submissions[currentSlide]}
          onChooseWinner={onChooseWinner}
        />
      )}
    </Paper>
  )
}

export default SubmissionList

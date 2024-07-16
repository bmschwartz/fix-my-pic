import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { Bounty, BountyState } from '@/types/bounty'
import { BountySubmission } from '@/types/submission'
import Link from 'next/link'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useCallback, useEffect, useState } from 'react'
import SubmissionCard from './SubmissionCard'
import { useBounty } from '@/hooks/useBounty'
import { useWallet } from '@/hooks/useWallet'

export const SubmissionList = ({ bounty }: { bounty: Bounty }) => {
  const { getBountySubmissions } = useSubmissions()
  const { selectedWallet, selectedAccount } = useWallet()
  const { payOutReward } = useBounty()
  const [submissions, setSubmissions] = useState<BountySubmission[]>([])
  const [loading, setLoading] = useState(true)
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
        ) : (
          submissions.map((submission: BountySubmission) => (
            <SubmissionCard
              key={submission.address}
              submission={submission}
              displayChooseWinner={displayChooseWinner}
              onChooseWinner={onChooseWinner}
            />
          ))
        )}
      </Grid>
    </Paper>
  )
}

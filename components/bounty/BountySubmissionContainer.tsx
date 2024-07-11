import { Button, Grid, Paper, Typography } from '@mui/material'
import { BountySubmissionList } from './BountySubmissionList'
import { Bounty } from '@/types/bounty'

export const BountySubmissionContainer = ({ bounty }: { bounty: Bounty }) => {
  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Submissions</Typography>
        <Button variant="contained" color="primary">
          Submit Edit
        </Button>
      </Grid>
      <BountySubmissionList submissions={bounty.submissions} />
    </Paper>
  )
}

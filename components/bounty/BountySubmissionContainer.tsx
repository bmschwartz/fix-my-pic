import { Button, Card, CardContent, CardMedia, Grid, Paper, Typography } from '@mui/material'
import { Bounty } from '@/types/bounty'
import { BountySubmission } from '@/types/submission'
import Link from 'next/link'
import { useSubmissions } from '@/hooks/useSubmissions'

export const BountySubmissionContainer = ({ bounty }: { bounty: Bounty }) => {
  const { submissions } = useSubmissions()

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Submissions</Typography>
        <Link href={`/submission/new?bountyAddress=${bounty.address}`} passHref>
          <Button variant="contained" color="primary">
            Submit Edit
          </Button>
        </Link>
      </Grid>
      <Grid container spacing={3} mt={2}>
        {submissions[bounty.address].map((submission: BountySubmission) => (
          <Grid item xs={12} sm={6} md={4} key={submission.address}>
            <Card>
              <CardMedia
                component="img"
                src={`https://ipfs.io/ipfs/${submission.imageId}`}
                style={{ height: '200px' }}
              />
              <CardContent>
                <Typography variant="body2">{submission.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

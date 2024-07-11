import React from 'react'
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material'
import { BountySubmission } from '@/types/submission'
import { Bounty } from '@/types/bounty'

export const BountySubmissionList = ({ bounty }: { bounty: Bounty }) => {
  const { submissions } = bounty

  return (
    <Grid container spacing={3} mt={2}>
      {submissions.map((submission: BountySubmission) => (
        <Grid item xs={12} sm={6} md={4} key={submission.address}>
          <Card>
            <CardMedia
              component="img"
              src={`https://ipfs.io/ipfs/${submission.imageId}`}
              style={{ height: '200px' }}
            />
            <CardContent>
              {/* <Typography variant="h6" gutterBottom>
                {submission.title}
              </Typography> */}
              <Typography variant="body2">{submission.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

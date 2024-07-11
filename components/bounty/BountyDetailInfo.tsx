import { Bounty } from '@/types/bounty'
import { Button, Grid, Paper, Typography } from '@mui/material'

export const BountyDetailInfo = ({ bounty }: { bounty: Bounty }) => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `https://ipfs.io/ipfs/${bounty.imageId}`
    link.download = `${bounty.title}.jpg`
    link.click()
  }

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <img
            src={`https://ipfs.io/ipfs/${bounty.imageId}`}
            alt={bounty.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {bounty.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {bounty.description}
          </Typography>
          <Typography variant="h6">Reward: {bounty.reward}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
            style={{ marginTop: '16px' }}
          >
            Download Image
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

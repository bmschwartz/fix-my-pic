import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { ImageRequest } from '@/types/imageRequest'
import { ethDisplayWithUSDString } from '@/utils/currency'
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

export const ImageRequestDetailInfo = ({ imageRequest }: { imageRequest: ImageRequest }) => {
  const { ethToUsdRate } = useEthUsdRate()

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `https://ipfs.io/ipfs/${imageRequest.imageId}`
    link.download = `${imageRequest.title}.jpg`
    link.click()
  }

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <img
            src={`https://ipfs.io/ipfs/${imageRequest.imageId}`}
            alt={imageRequest.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {imageRequest.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {imageRequest.description}
          </Typography>
          <Typography variant="h6">
            Budget:{' '}
            {ethToUsdRate ? (
              ethDisplayWithUSDString(imageRequest.budget, ethToUsdRate)
            ) : (
              <CircularProgress size={20} />
            )}
          </Typography>
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

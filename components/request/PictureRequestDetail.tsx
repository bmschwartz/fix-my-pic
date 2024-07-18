import { useEthUsdRate } from '@/hooks/useEthUsdRate'
import { PictureRequest } from '@/types/pictureRequest'
import { ethDisplayWithUSDString } from '@/utils/currency'
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'

export const PictureRequestDetail = ({ pictureRequest }: { pictureRequest: PictureRequest }) => {
  const { ethToUsdRate } = useEthUsdRate()

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pictureRequest.imageUrl
    link.download = `${pictureRequest.title}.jpg`
    link.click()
  }

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <img
            src={pictureRequest.imageUrl}
            alt={pictureRequest.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {pictureRequest.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {pictureRequest.description}
          </Typography>
          <Typography variant="h6">
            Budget:{' '}
            {ethToUsdRate ? (
              ethDisplayWithUSDString(pictureRequest.budget, ethToUsdRate)
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

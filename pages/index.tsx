import { PictureRequestHome } from '@/components/request'
import { SelectedWallet } from '@/components/wallet'
import { Box, Container } from '@mui/material'

export default function Home() {
  return (
    <Container>
      <SelectedWallet />
      <Box mt={4} mb={4}>
        <PictureRequestHome />
      </Box>
    </Container>
  )
}

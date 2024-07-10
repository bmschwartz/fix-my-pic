import { useRouter } from 'next/router'
import { Box, Button, Container } from '@mui/material'
import { NewBountyForm } from '@/components/bounty'

export default function NewBountyPage() {
  const router = useRouter()

  return (
    <Container
      sx={{
        marginTop: 4, // Adds a top margin to the Container
        marginBottom: 4, // Adds a bottom margin to the Container
        paddingLeft: 2, // Adds left padding to the Container
        paddingRight: 2, // Adds right padding to the Container
      }}
    >
      <Button variant="outlined" onClick={() => router.back()}>
        Back
      </Button>
      <Box
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          marginTop: '40px',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <NewBountyForm onCreated={() => router.push('/')} />
      </Box>
    </Container>
  )
}

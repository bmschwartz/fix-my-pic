import { useRouter } from 'next/router'
import { Box, Button, Container } from '@mui/material'
import { NewRequestForm } from '@/components/request'

export default function NewRequestPage() {
  const router = useRouter()

  return (
    <Container
      sx={{
        marginTop: 4,
        marginBottom: 4,
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Box mt={4} mb={4}>
        <Button variant="contained" color="primary" onClick={() => router.push('/')}>
          Back
        </Button>
      </Box>
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
        <NewRequestForm onCreated={() => router.push('/')} />
      </Box>
    </Container>
  )
}

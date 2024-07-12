import { useRouter } from 'next/router'
import { Box, Button, Container } from '@mui/material'
import NewSubmissionForm from '@/components/submission/NewSubmissionForm'

export default function NewSubmissionPage() {
  const router = useRouter()
  const bountyAddress = router.query.bountyAddress as string

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
        <Button variant="contained" color="primary" onClick={() => router.back()}>
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
        <NewSubmissionForm bountyAddress={bountyAddress} onCreated={() => router.back()} />
      </Box>
    </Container>
  )
}

import { useRouter } from 'next/router'
import { Box, Button, Container } from '@mui/material'
import NewSubmissionForm from '@/components/submission/NewSubmissionForm'

export default function NewSubmissionPage() {
  const router = useRouter()
  const requestAddress = router.query.requestAddress as string

  const onSubmissionCreated = () => {
    router.push(`/request/${requestAddress}`)
  }

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
        <NewSubmissionForm requestAddress={requestAddress} onCreated={onSubmissionCreated} />
      </Box>
    </Container>
  )
}

import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { BackButton, NewSubmissionForm } from '@/components';

const NewSubmissionView: React.FC = () => {
  const router = useRouter();
  const requestId = router.query.request as string;

  return (
    <Box sx={{ my: 4 }}>
      <BackButton href={`/request/${requestId}`} sx={{ mb: 4 }} />
      <NewSubmissionForm requestId={requestId} />
    </Box>
  );
};

export default NewSubmissionView;

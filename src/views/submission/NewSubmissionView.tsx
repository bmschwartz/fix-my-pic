import { Box } from '@mui/material';
import React from 'react';

import { BackButton, NewSubmissionForm } from '@/components';
import { useRequestDetail } from '@/hooks/useRequestDetail';
import { Request } from '@/types/request';

interface NewSubmissionViewProps {
  request: Request;
}

const NewSubmissionView: React.FC<NewSubmissionViewProps> = ({ request }) => {
  const { setIsCreatingNewSubmission } = useRequestDetail();

  return (
    <Box sx={{ my: 4 }}>
      <BackButton onClick={() => setIsCreatingNewSubmission(false)} sx={{ mb: 4 }} />
      <NewSubmissionForm requestId={request.id} />
    </Box>
  );
};

export default NewSubmissionView;

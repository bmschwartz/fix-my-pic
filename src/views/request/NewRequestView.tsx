import { Box } from '@mui/material';
import React from 'react';

import { BackButton, NewRequestForm } from '@/components';

const NewRequestView: React.FC = () => {
  return (
    <Box sx={{ my: 4 }}>
      <BackButton href="/" sx={{ mb: 4 }} />
      <NewRequestForm />
    </Box>
  );
};

export default NewRequestView;

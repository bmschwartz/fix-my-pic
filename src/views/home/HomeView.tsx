import { Box } from '@mui/material';
import React from 'react';

import { LinkButton, RequestList } from '@/components';

const HomeView: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <LinkButton
        text="Create Request"
        href="/request/new"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 4,
        }}
      />
      <RequestList />
    </Box>
  );
};

export default HomeView;

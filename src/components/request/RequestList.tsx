import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import React from 'react';

import { useRequests } from '@/hooks/useRequests';
import { Request } from '@/types/request';
import FullScreenLoader from '../common/FullScreenLoader';
import RequestListItem from './RequestListItem';

const EmptyState: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        No Requests Yet
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Be the first to create a request!
      </Typography>
    </Box>
  );
};
const RequestList: React.FC = () => {
  const { requests, loading: loadingRequests } = useRequests();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const getCols = () => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return 2;
    if (isLargeScreen) return 3;
    return 1;
  };

  if (loadingRequests) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {requests.length === 0 ? (
        <EmptyState />
      ) : (
        <ImageList
          variant="masonry"
          cols={getCols()}
          gap={24}
          sx={{
            padding: '16px',
            overflow: 'hidden',
          }}
        >
          {requests.map((request: Request) => (
            <RequestListItem key={request.id} pictureRequest={request} />
          ))}
        </ImageList>
      )}
    </>
  );
};

export default RequestList;

import { Description, MonetizationOn } from '@mui/icons-material';
import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

import { ImageOverlay } from '@/components';
import { Request } from '@/types/request';
import { getImageUrl } from '@/utils/getImage';

interface RequestDetailInfoSectionProps {
  request: Request;
}

const RequestDetailInfoSection: React.FC<RequestDetailInfoSectionProps> = ({ request }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const imageUrl = getImageUrl(request.imageId);

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 400,
            padding: 2,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={handleImageClick}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              minHeight: 300,
            }}
          >
            <Image src={imageUrl} alt={request.title} layout="fill" objectFit="cover" />
          </Box>
        </Box>
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 3,
            textAlign: 'left',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            {request.title}
          </Typography>
          <Divider sx={{ width: '100%', mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Description sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">{request.description}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <MonetizationOn sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">${request.budget}</Typography>
          </Box>
        </Box>
      </Box>
      {isOverlayOpen && (
        <ImageOverlay
          imageUrl={imageUrl}
          onClose={handleOverlayClose}
          onDownload={() => {
            window.open(imageUrl, '_blank');
          }}
        />
      )}
    </>
  );
};

export default RequestDetailInfoSection;

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
            borderRadius: 4,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
            },
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
            <Image src={imageUrl} alt={request.title} fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
          </Box>
        </Box>
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 3,
            textAlign: 'left',
            borderRadius: 4,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {request.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: -1, fontWeight: '300' }}>
              Budget: ${request.budget}
            </Typography>
            <Divider sx={{ width: '100%', mb: 2 }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                padding: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Typography variant="body1">{request.description}</Typography>
            </Box>
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

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Chip } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

import { ImageOverlay } from '@/components';
import { SubmissionPurchase } from '@/types/purchase';

interface PurchaseListItemProps {
  purchase: SubmissionPurchase;
  imageUrlToShow: string;
}

const PurchaseListItem: React.FC<PurchaseListItemProps> = ({ purchase, imageUrlToShow }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const generateChip = () => {
    return (
      <Chip
        icon={<CheckCircleIcon />}
        label="Purchased"
        color="success"
        size="medium"
        sx={{
          fontWeight: 600,
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10,
          color: 'white',
          backgroundColor: 'success',
        }}
      />
    );
  };

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
          borderRadius: 4,
          '&:hover': {
            transform: 'scale(1.05)',
            transformOrigin: 'center',
            zIndex: 1,
          },
          '&:hover .overlay': {
            opacity: 1,
          },
        }}
      >
        <Image
          src={imageUrlToShow}
          alt="Purchase"
          layout="responsive"
          width={150}
          height={150}
          objectFit="cover"
          onClick={handleImageClick}
        />
        {generateChip()}
      </Box>
      {isOverlayOpen && (
        <ImageOverlay
          imageUrl={imageUrlToShow}
          onClose={handleOverlayClose}
          description={purchase.submissionDescription}
          onDownload={() => {
            window.open(imageUrlToShow, '_blank');
          }}
        />
      )}
    </>
  );
};

export default PurchaseListItem;

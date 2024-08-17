import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Chip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ImageOverlay, LoadingOverlay } from '@/components';
import { useContractService } from '@/hooks/useContractService';
import { useWallet } from '@/hooks/useWallet';
import { RequestSubmission } from '@/types/submission';

interface SubmissionListItemProps {
  submission: RequestSubmission;
  imageUrlToShow: string;
}

const SubmissionListItem: React.FC<SubmissionListItemProps> = ({ submission, imageUrlToShow }) => {
  const router = useRouter();
  const { contractService } = useContractService();
  const { selectedWallet, selectedAccount, connectWallet } = useWallet();

  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const isFree = submission.price === 0;
  const purchasedSubmission = submission.purchases.find(
    (purchase) => purchase.buyer.toLowerCase() === selectedAccount?.toLowerCase()
  );

  const generateChip = () => {
    let label: string;
    let icon: React.ReactElement = <></>;
    let backgroundColor = 'black';

    if (purchasedSubmission) {
      label = 'Purchased';
      icon = <CheckCircleIcon />;
      backgroundColor = 'success';
    } else if (isFree) {
      label = 'Free';
    } else {
      label = `$${submission.price}`;
      icon = <MonetizationOnIcon color="inherit" />;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={purchasedSubmission ? 'success' : 'default'}
        size="medium"
        sx={{
          fontWeight: 600,
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10,
          color: 'white',
          backgroundColor: backgroundColor || 'inherit',
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
          alt="Submission"
          layout="responsive"
          width={150}
          height={150}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          onClick={handleImageClick}
        />
        {generateChip()}
      </Box>
      {isOverlayOpen && (
        <ImageOverlay
          imageUrl={imageUrlToShow}
          onClose={handleOverlayClose}
          description={submission.description}
          price={purchasedSubmission ? 0 : submission.price}
          onDownload={async () => {
            if (!submission.price || purchasedSubmission) {
              window.open(imageUrlToShow, '_blank');
              return;
            }

            if (!selectedWallet || !selectedAccount) {
              handleOverlayClose();
              connectWallet();
              return;
            }

            setLoading(true);
            setIsOverlayOpen(false);
            setLoadingLabel('Purchasing image...');

            try {
              await contractService.purchaseSubmission({
                account: selectedAccount,
                wallet: selectedWallet,
                address: submission.id,
              });

              router.reload();
            } catch (error) {
              console.error('Error purchasing image:', error);
            } finally {
              setLoadingLabel('');
              setIsOverlayOpen(false);
              setLoading(false);
            }
          }}
        />
      )}
      <LoadingOverlay loading={loading} label={loadingLabel} />
    </>
  );
};

export default SubmissionListItem;

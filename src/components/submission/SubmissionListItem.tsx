import { Box } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ConnectWalletDialog, FMPTypography, ImageOverlay, LoadingOverlay } from '@/components';
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
  const { selectedWallet, selectedAccount } = useWallet();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const isFree = submission.price === 0;
  const purchasedSubmission = submission.purchases.find((purchase) => purchase.buyer === selectedAccount);

  const handleImageClick = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ cursor: 'pointer' }}>
        <Image
          src={imageUrlToShow}
          alt="Submission"
          layout="responsive"
          width={150}
          height={150}
          objectFit="cover"
          onClick={handleImageClick}
        />
      </Box>
      <Box sx={{ padding: 0 }}>
        <FMPTypography variant="body1">{!isFree ? `$${submission.price}` : 'Free'}</FMPTypography>
        {!isFree && (
          <FMPTypography variant="body1">
            {submission.purchases.length} purchase{submission.purchases.length !== 1 && 's'}
          </FMPTypography>
        )}
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
              setDialogOpen(true);
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
      <ConnectWalletDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default SubmissionListItem;

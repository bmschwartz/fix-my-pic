import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';

import { FMPButton, SubmissionListItem } from '@/components';
import { useImageStore } from '@/hooks/useImageStore';
import { useRequestDetail } from '@/hooks/useRequestDetail';
import { useWallet } from '@/hooks/useWallet';
import { RequestSubmission } from '@/types/submission';

interface RequestDetailSubmissionTabProps {
  submissions: RequestSubmission[];
}

const EmptyState: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        No Submissions Yet
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Be the first to submit your work!
      </Typography>
    </Box>
  );
};

const RequestDetailSubmissionTab: React.FC<RequestDetailSubmissionTabProps> = ({ submissions }) => {
  const theme = useTheme();
  const { selectedAccount, isConnected, connectWallet } = useWallet();
  const { getImageUrlToShow } = useImageStore();
  const { setIsCreatingNewSubmission } = useRequestDetail();

  const [loadedImages, setLoadedImages] = React.useState<boolean>(false);
  const [imageUrlsToShow, setImageUrlsToShow] = React.useState<Record<string, string>>({});

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const hasPurchased = (submission: RequestSubmission) => {
    return submission.purchases.some((purchase) => purchase.buyer.toLowerCase() === selectedAccount?.toLowerCase());
  };

  const submissionsWithPurchasedFirst = submissions.sort((a, b) => {
    if (hasPurchased(a) && !hasPurchased(b)) {
      return -1;
    }
    if (!hasPurchased(a) && hasPurchased(b)) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    if (loadedImages) {
      return;
    }

    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        submissions.map(async (submission) => {
          const imageUrl = await getImageUrlToShow(submission);
          return { id: submission.id, imageUrl };
        })
      );

      const newImageUrlsToShow: Record<string, string> = {};
      urls.forEach(({ id, imageUrl }) => {
        newImageUrlsToShow[id] = imageUrl;
      });

      setImageUrlsToShow(newImageUrlsToShow);
      setLoadedImages(true);
    };

    if (submissions.length > 0) {
      fetchImageUrls();
    }
  }, [submissions, loadedImages, getImageUrlToShow]);

  const getCols = () => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return 2;
    if (isLargeScreen) return 3;
    return 1;
  };

  return (
    <Box sx={{ mt: 3, position: 'relative' }}>
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <FMPButton
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            if (!isConnected) {
              connectWallet();
              return;
            }
            setIsCreatingNewSubmission(true);
          }}
        >
          New Submission
        </FMPButton>
      </Box>
      {submissionsWithPurchasedFirst.length === 0 ? (
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
          {submissionsWithPurchasedFirst.map((submission) => (
            <ImageListItem key={submission.id}>
              {imageUrlsToShow[submission.id] && (
                <SubmissionListItem submission={submission} imageUrlToShow={imageUrlsToShow[submission.id]} />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default RequestDetailSubmissionTab;

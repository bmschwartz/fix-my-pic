import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { LinkButton, SubmissionListItem } from '@/components';
import { useImageStore } from '@/hooks/useImageStore';
import { RequestSubmission } from '@/types/submission';

interface RequestDetailSubmissionTabProps {
  requestId: string;
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

const RequestDetailSubmissionTab: React.FC<RequestDetailSubmissionTabProps> = ({ requestId, submissions }) => {
  const [loadingImageUrls, setLoadingImageUrls] = React.useState(true);
  const [loadedImages, setLoadedImages] = React.useState<boolean>(false);
  const [imageUrlsToShow, setImageUrlsToShow] = React.useState<Record<string, string>>({});
  const { getImageUrlToShow } = useImageStore();

  useEffect(() => {
    if (loadedImages) {
      return;
    }

    const fetchImageUrls = async () => {
      setLoadingImageUrls(true);

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
      setLoadingImageUrls(false);
      setLoadedImages(true);
    };

    if (submissions.length > 0) {
      fetchImageUrls();
    } else {
      setLoadingImageUrls(false);
    }
  }, [submissions, loadedImages, setLoadingImageUrls, getImageUrlToShow]);

  return (
    <Box sx={{ mt: 3, position: 'relative' }}>
      {loadingImageUrls && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <LinkButton text="New Submission" href={`/submission/new?request=${requestId}`} />
      </Box>
      {submissions.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {submissions.map((submission) => (
            <Grid item xs={12} sm={6} md={4} key={submission.id}>
              {imageUrlsToShow[submission.id] && (
                <SubmissionListItem submission={submission} imageUrlToShow={imageUrlsToShow[submission.id]} />
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RequestDetailSubmissionTab;

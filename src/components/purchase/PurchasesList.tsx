import { Box, Divider, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import { FMPTypography, PurchaseListItem } from '@/components';
import { useImageStore } from '@/hooks/useImageStore';
import { SubmissionPurchase } from '@/types/purchase';

interface PurchasesListProps {
  purchases: SubmissionPurchase[];
}

const EmptyState: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <FMPTypography variant="h6" gutterBottom fontWeight={600}>
        No Purchases Yet
      </FMPTypography>
      <FMPTypography variant="body1" color="textSecondary">
        Explore the submissions and make your first purchase!
      </FMPTypography>
    </Box>
  );
};

const PurchasesList: React.FC<PurchasesListProps> = ({ purchases }) => {
  const theme = useTheme();
  const { getDecryptedImageUrl } = useImageStore();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [loadedImages, setLoadedImages] = useState<boolean>(false);
  const [imageUrlsToShow, setImageUrlsToShow] = useState<Record<string, string>>({});

  const getCols = () => {
    if (isSmallScreen) return 1;
    if (isMediumScreen) return 2;
    if (isLargeScreen) return 3;
    return 1;
  };

  useEffect(() => {
    if (loadedImages) {
      return;
    }

    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        purchases.map(async (purchase) => {
          const imageUrl = await getDecryptedImageUrl(
            purchase.submissionAddress,
            purchase.encryptedPictureId as string
          );
          return { id: purchase.id, imageUrl };
        })
      );

      const newImageUrlsToShow: Record<string, string> = {};
      urls.forEach(({ id, imageUrl }) => {
        newImageUrlsToShow[id] = imageUrl;
      });

      setImageUrlsToShow(newImageUrlsToShow);
      setLoadedImages(true);
    };

    if (purchases.length > 0) {
      fetchImageUrls();
    }
  }, [purchases, loadedImages, getDecryptedImageUrl]);

  return (
    <Box sx={{ mx: 'auto', p: 3 }}>
      <FMPTypography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: 'center',
          marginBottom: 3,
          position: 'relative',
          paddingBottom: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: '50%',
            height: '2px',
            backgroundColor: '#000000',
            borderRadius: '2px',
          },
          fontWeight: 'bold',
          letterSpacing: '0.1em',
        }}
      >
        Your Purchases
      </FMPTypography>
      <Divider sx={{ my: 3 }} />
      {purchases.length === 0 ? (
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
          {purchases.map((purchase) => (
            <ImageListItem key={purchase.id}>
              {imageUrlsToShow[purchase.id] && (
                <PurchaseListItem purchase={purchase} imageUrlToShow={imageUrlsToShow[purchase.id]} />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default PurchasesList;

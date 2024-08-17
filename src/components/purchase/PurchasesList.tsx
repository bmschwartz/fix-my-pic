import { Box, Divider } from '@mui/material';

import { FMPTypography } from '@/components';
import { SubmissionPurchase } from '@/types/purchase';

interface PurchasesListProps {
  purchases: SubmissionPurchase[];
}

const PurchasesList: React.FC<PurchasesListProps> = ({ purchases }) => {
  console.log('DEBUG PurchasesList', purchases);
  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
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
    </Box>
  );
};

export default PurchasesList;

import { Box } from '@mui/material';
import React from 'react';

import { BackButton } from '@/components';
import PurchasesList from '@/components/purchase/PurchasesList';
import { usePurchases } from '@/hooks/usePurchases';

const PurchasesView: React.FC = () => {
  const { purchases } = usePurchases();

  return (
    <Box sx={{ my: 4 }}>
      <BackButton href="/" sx={{ mb: 4 }} />
      <PurchasesList purchases={purchases} />
    </Box>
  );
};

export default PurchasesView;

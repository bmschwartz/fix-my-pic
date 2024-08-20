import React from 'react';

import { RequireWallet } from '@/components';
import PurchasesView from '@/views/purchases/PurchasesView';

const PurchasesPage = () => {
  return (
    <RequireWallet message="You need to connect your Web3 wallet to view Purchases">
      <PurchasesView />
    </RequireWallet>
  );
};

export default PurchasesPage;

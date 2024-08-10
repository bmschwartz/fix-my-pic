import React from 'react';

import { RequireWallet } from '@/components';
import NewRequestView from '@/views/request/NewRequestView';

const NewRequestPage: React.FC = () => {
  return (
    <RequireWallet message="You need to connect your Web3 wallet to Create a Request">
      <NewRequestView />
    </RequireWallet>
  );
};

export default NewRequestPage;

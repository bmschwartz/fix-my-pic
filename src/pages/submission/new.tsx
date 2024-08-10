import React from 'react';

import { RequireWallet } from '@/components';
import NewSubmissionView from '@/views/submission/NewSubmissionView';

const NewSubmissionPage: React.FC = () => {
  return (
    <RequireWallet message="You need to connect your Web3 wallet to Create a Submission">
      <NewSubmissionView />
    </RequireWallet>
  );
};

export default NewSubmissionPage;

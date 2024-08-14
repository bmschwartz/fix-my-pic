import React, { ReactNode, useEffect, useState } from 'react';

import { FullScreenLoader } from '@/components';
import { FixMyPicContractService, getFixMyPicContractService } from '@/services/contractService';
import { ContractServiceProvider } from './ContractServiceContext';
import { WalletProvider } from './WalletContext.tsx.old';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [contractService, setContractService] = useState<FixMyPicContractService>();

  useEffect(() => {
    async function initContractService() {
      setContractService(await getFixMyPicContractService());
    }

    initContractService();
  }, []);

  if (!contractService) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <ContractServiceProvider contractService={contractService}>
      <WalletProvider>{children}</WalletProvider>
    </ContractServiceProvider>
  );
};

export default AppProviders;

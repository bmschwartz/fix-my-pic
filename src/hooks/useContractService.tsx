import { useContext } from 'react';

import { ContractServiceContext, ContractServiceContextType } from '@/contexts/ContractServiceContext';

export const useContractService = (): ContractServiceContextType => {
  const context = useContext(ContractServiceContext);
  if (!context) {
    throw new Error('useContractService must be used within a ContractServiceProvider');
  }
  return context;
};

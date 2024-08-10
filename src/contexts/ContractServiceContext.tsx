import React, { createContext, ReactNode } from 'react';

import { FixMyPicContractService } from '@/services/contractService';

interface ContractServiceProviderProps {
  children: ReactNode;
  contractService: FixMyPicContractService;
}

export interface ContractServiceContextType {
  contractService: FixMyPicContractService;
}

export const ContractServiceContext = createContext<ContractServiceContextType | undefined>(undefined);

export const ContractServiceProvider: React.FC<ContractServiceProviderProps> = ({ children, contractService }) => {
  return <ContractServiceContext.Provider value={{ contractService }}>{children}</ContractServiceContext.Provider>;
};

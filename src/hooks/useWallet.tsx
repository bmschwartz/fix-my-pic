import { useContext } from 'react';

import { WalletProviderContext, WalletProviderContextType } from '@/contexts/WalletContext';

export const useWallet = (): WalletProviderContextType => {
  const context = useContext(WalletProviderContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

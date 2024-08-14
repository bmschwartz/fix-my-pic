import { useWeb3Modal } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

export interface WalletProviderContextType {
  walletProvider: ethers.Eip1193Provider | undefined; // The selected wallet provider.
  selectedAccount: string | null; // The selected account address.
  isConnected: boolean; // Whether the wallet is connected.
  connectWallet: () => Promise<void>; // Function to connect wallets.
  disconnectWallet: () => void; // Function to disconnect wallets.
  clearError: () => void;
}

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProviderContext = createContext<WalletProviderContextType | undefined>(undefined);

// The WalletProvider component wraps all other components in the dapp, providing them with the
// necessary data and functions related to wallets.
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { open: connectWallet } = useWeb3Modal();

  const contextValue: WalletProviderContextType = {
    // wallets,
    // selectedWallet: selectedWalletRdns === null ? null : wallets[selectedWalletRdns],
    // selectedAccount: selectedWalletRdns === null ? null : selectedAccountByWalletRdns[selectedWalletRdns],
    // errorMessage,
    connectWallet,

    // disconnectWallet,
    // clearError,
  };

  return <WalletProviderContext.Provider value={contextValue}>{children}</WalletProviderContext.Provider>;
};

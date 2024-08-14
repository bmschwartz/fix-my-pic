import {
  useDisconnect,
  useWalletInfo,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { createContext, ReactNode } from 'react';

export interface WalletDetail {
  provider?: ethers.Eip1193Provider;
  info?: { name?: string; icon?: string };
}

export interface WalletProviderContextType {
  selectedWallet: WalletDetail; // The selected wallet detail.
  selectedAccount: string | null; // The selected account address.
  isConnected: boolean; // Whether the wallet is connected.
  connectWallet: () => Promise<void>; // Function to connect wallets.
  disconnectWallet: () => void; // Function to disconnect wallets.
}

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProviderContext = createContext<WalletProviderContextType | undefined>(undefined);

// The WalletProvider component wraps all other components in the dapp, providing them with the
// necessary data and functions related to wallets.
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { open: connectWallet } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { walletInfo } = useWalletInfo();

  const contextValue: WalletProviderContextType = {
    isConnected,
    connectWallet,
    disconnectWallet: disconnect,
    selectedAccount: address,
    selectedWallet: { provider: walletProvider, info: walletInfo },
  };

  return <WalletProviderContext.Provider value={contextValue}>{children}</WalletProviderContext.Provider>;
};

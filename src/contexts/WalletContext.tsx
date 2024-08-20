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
  chainId?: number;
  provider?: ethers.Eip1193Provider;
  info?: { name?: string; icon?: string };
}

export interface WalletProviderContextType {
  selectedWallet: WalletDetail;
  selectedAccount: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
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
  const { isConnected, address, chainId: selectedChainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { walletInfo } = useWalletInfo();

  const contextValue: WalletProviderContextType = {
    isConnected,
    selectedAccount: address,
    selectedWallet: { provider: walletProvider, info: walletInfo, chainId: selectedChainId },

    connectWallet,
    disconnectWallet: disconnect,
  };

  return <WalletProviderContext.Provider value={contextValue}>{children}</WalletProviderContext.Provider>;
};

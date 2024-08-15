import { createWeb3Modal } from '@web3modal/ethers/react';

import Web3ModalConfig from '@/config/web3modal';

createWeb3Modal(Web3ModalConfig);

export function AppKit({ children }: { children: React.ReactNode }) {
  return children;
}

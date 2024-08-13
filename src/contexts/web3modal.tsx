import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

import { siweConfig } from '@/config/siwe';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
console.log('projectId', projectId);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zkSyncEra = {
  chainId: 324,
  name: 'ZKsync Era Mainnet',
  currency: 'ETH',
  explorerUrl: 'https://explorer.zksync.io',
  rpcUrl: 'https://mainnet.era.zksync.io',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zkSyncSepoliaTestnet = {
  chainId: 300,
  name: 'ZKsync Sepolia Testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.explorer.zksync.io',
  rpcUrl: 'https://sepolia.era.zksync.dev',
};

const zkSyncLocal = {
  chainId: 270,
  name: 'ZKsync Dockerized Node',
  currency: 'ETH',
  explorerUrl: 'https://localhost:4000',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
};

const metadata = {
  name: 'Fix My Pic',
  description: 'Request and pay for photo editing services',
  url: 'https://preview.fixmypic.io',
  icons: ['https://preview.fixmypic.io/favicon.ico'],
};

const ethersConfig = defaultConfig({
  metadata,
});

createWeb3Modal({
  projectId,
  siweConfig,
  ethersConfig,
  enableAnalytics: true,
  chains: [zkSyncLocal],
});

export function AppKit({ children }: { children: React.ReactNode }) {
  return children;
}

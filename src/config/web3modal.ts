import { defaultConfig } from '@web3modal/ethers/react';

import { siweConfig } from '@/config/siwe';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set');
}

const nodeEnv = process.env.NODE_ENV || 'development';

// const zkSyncEra = {
//   chainId: 324,
//   name: 'ZKsync Era Mainnet',
//   currency: 'ETH',
//   explorerUrl: 'https://explorer.zksync.io',
//   rpcUrl: 'https://mainnet.era.zksync.io',
// };

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

const chains = {
  development: zkSyncLocal,
  test: zkSyncSepoliaTestnet,
  production: zkSyncSepoliaTestnet,
};

if (!chains[nodeEnv]) {
  throw new Error(`Chain not found for node env: ${nodeEnv}`);
}

const metadata = {
  name: 'Fix My Pic',
  description: 'Request and pay for photo editing services',
  url: 'https://fixmypic.io',
  icons: ['https://fixmypic.io/favicon.ico'],
};

const ethersConfig = defaultConfig({
  metadata,
});

const Web3ModalConfig = {
  projectId,
  siweConfig,
  ethersConfig,
  enableAnalytics: true,
  chains: [chains[nodeEnv]],
  allowUnsupportedChain: false,
  defaultChain: chains[nodeEnv],
};

export default Web3ModalConfig;

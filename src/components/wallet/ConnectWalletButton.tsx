import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

import { FMPButton } from '@/components';

const ConnectWalletButton: React.FC = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();

  return (
    <FMPButton onClick={() => open()} sx={{ marginTop: '16px' }}>
      {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </FMPButton>
  );
};

export default ConnectWalletButton;

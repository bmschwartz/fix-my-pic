import { FMPButton } from '@/components';
import { useWallet } from '@/hooks/useWallet';

const ConnectWalletButton: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <FMPButton onClick={() => connectWallet()} sx={{ marginTop: '16px' }}>
      {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </FMPButton>
  );
};

export default ConnectWalletButton;

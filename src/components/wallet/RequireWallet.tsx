import { Box } from '@mui/material';
import React from 'react';

import { ConnectWalletButton, FMPTypography } from '@/components';
import { defaultChain } from '@/config/web3modal';
import { useWallet } from '@/hooks/useWallet';

interface RequireWalletProps {
  children: React.ReactNode;
  message?: string;
}

const RequireWallet: React.FC<RequireWalletProps> = ({ children, message }) => {
  const { selectedWallet, selectedAccount } = useWallet();

  const connectedToCorrectNetwork = selectedWallet.chainId === defaultChain.chainId;

  if (selectedAccount && selectedWallet && connectedToCorrectNetwork) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '10vh',
        textAlign: 'center',
        bgcolor: 'background.default',
        padding: '24px',
      }}
    >
      <Box sx={{ maxWidth: 700, width: '100%', padding: '24px', borderRadius: '8px', boxShadow: 3 }}>
        <FMPTypography variant="h6" gutterBottom>
          {message || 'You need to connect your Web3 wallet to access this content.'}
        </FMPTypography>
        {!connectedToCorrectNetwork && (
          <FMPTypography variant="body1" color="error">
            Please connect to the correct network. {defaultChain.name} is required.
          </FMPTypography>
        )}
        <ConnectWalletButton />
      </Box>
    </Box>
  );
};

export default RequireWallet;

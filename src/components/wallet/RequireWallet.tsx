import { Box } from '@mui/material';
import React from 'react';

import { ConnectWalletButton, FMPTypography } from '@/components';
import { useWallet } from '@/hooks/useWallet';

interface RequireWalletProps {
  children: React.ReactNode;
  message?: string;
}

const RequireWallet: React.FC<RequireWalletProps> = ({ children, message }) => {
  const { selectedWallet, selectedAccount } = useWallet();

  if (selectedAccount && selectedWallet) {
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
        <ConnectWalletButton />
      </Box>
    </Box>
  );
};

export default RequireWallet;

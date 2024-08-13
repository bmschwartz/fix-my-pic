import { AppBar, Avatar, Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ConnectWalletButton } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import FMPButton from './FMPButton';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { selectedWallet, selectedAccount, disconnectWallet } = useWallet();

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default, padding: '15px' }}>
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Link href="/" passHref>
                <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  {isMdUp ? (
                    <Image src="/logo.png" alt="Fix My Pic Logo" width={265} height={50} />
                  ) : (
                    <Image src="/logo-icon-only.png" alt="Fix My Pic Logo" width={75} height={50} />
                  )}
                </Box>
              </Link>
            </Box>
            {selectedWallet && selectedAccount ? (
              <FMPButton
                onClick={disconnectWallet}
                startIcon={
                  <Avatar
                    src={selectedWallet.info.icon}
                    alt={selectedWallet.info.name}
                    sx={{ width: 24, height: 24, marginRight: 1 }}
                  />
                }
              >
                Disconnect {selectedWallet.info.name}
              </FMPButton>
            ) : (
              <ConnectWalletButton />
            )}
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );
};

export default Header;

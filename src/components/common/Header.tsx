import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { AccountMenu, ConnectWalletButton } from '@/components';
import { useWallet } from '@/hooks/useWallet';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { selectedWallet, selectedAccount } = useWallet();

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
            {selectedWallet && selectedAccount ? <AccountMenu /> : <ConnectWalletButton />}
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );
};

export default Header;

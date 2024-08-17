import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logout from '@mui/icons-material/Logout';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { FMPButton, FMPTypography } from '@/components';
import { useWallet } from '@/hooks/useWallet';

const AccountMenu: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { selectedWallet, selectedAccount, disconnectWallet } = useWallet();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onPurchasesPressed = () => {
    router.push('/purchases');
    handleClose();
  };

  const onDisconnectPressed = () => {
    disconnectWallet();
    handleClose();
  };

  return (
    <Box>
      <FMPButton
        onClick={handleClick}
        startIcon={
          <Avatar
            src={selectedWallet.info?.icon}
            alt={selectedWallet.info?.name}
            sx={{ width: 24, height: 24, marginRight: 1 }}
          />
        }
        endIcon={<ExpandMoreIcon sx={{ width: 24, height: 24, color: 'black' }} />}
        sx={{ textTransform: 'none' }}
      >
        {selectedAccount?.slice(0, 16)}…
      </FMPButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              color: '#000000',
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              fontWeight: 600,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onPurchasesPressed}>
          <ListItemIcon>
            <ShoppingCart fontSize="small" />
          </ListItemIcon>
          <FMPTypography variant="body2" sx={{ fontWeight: 600 }}>
            Purchases
          </FMPTypography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onDisconnectPressed}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <FMPTypography variant="body2" sx={{ fontWeight: 600 }}>
            Disconnect
          </FMPTypography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountMenu;

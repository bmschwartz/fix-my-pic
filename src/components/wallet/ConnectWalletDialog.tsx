import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

import { FMPTypography } from '@/components';
import { useWallet } from '@/hooks/useWallet';
import { EIP6963ProviderDetail } from '@/types/eip6963';

interface ConnectWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

const ConnectWalletDialog: React.FC<ConnectWalletDialogProps> = ({ open, onClose }) => {
  const { wallets, connectWallet } = useWallet();

  const handleConnectWallet = async (walletRdns: string) => {
    await connectWallet(walletRdns);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#FFFFFF' }}>
        <FMPTypography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
          Connect Wallet
        </FMPTypography>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#FFFFFF', paddingBottom: 1 }}>
        <List>
          {Object.keys(wallets).length > 0 ? (
            Object.values(wallets).map((provider: EIP6963ProviderDetail) => (
              <ListItem
                component="button"
                onClick={() => handleConnectWallet(provider.info.rdns)}
                key={provider.info.uuid}
                sx={{
                  color: '#000000',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  width: '100%',
                  outline: 'none',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={provider.info.icon} alt={provider.info.name} sx={{ backgroundColor: '#FFFFFF' }} />
                </ListItemAvatar>
                <ListItemText primary={provider.info.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    There are no announced providers
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#FFFFFF' }}>
        <Button onClick={onClose} sx={{ color: '#000000', fontWeight: 'bold' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectWalletDialog;

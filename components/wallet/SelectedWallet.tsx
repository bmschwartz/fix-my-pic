import React from 'react'
import { useWallet } from '@/hooks/useWallet'
import { ConnectWallet } from './ConnectWallet'
import { Button, Typography, Box } from '@mui/material'

export const SelectedWallet = () => {
  const { selectedWallet, selectedAccount, disconnectWallet } = useWallet()

  return (
    <Box>
      {!selectedAccount && <ConnectWallet />}
      {selectedAccount && selectedWallet && (
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={disconnectWallet}>
            Disconnect {selectedWallet.info.name}
          </Button>
        </Box>
      )}
    </Box>
  )
}

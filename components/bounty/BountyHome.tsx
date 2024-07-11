import React from 'react'
import { useRouter } from 'next/router'
import { Button, Box } from '@mui/material'
import { useWallet } from '@/hooks/useWallet'
import { SelectedWallet } from '@/components/wallet'
import { BountyList } from './BountyList'

export const BountyHome: React.FC = () => {
  const router = useRouter()
  const { selectedWallet, selectedAccount } = useWallet()

  return (
    <Box p={2}>
      <SelectedWallet />
      {selectedWallet && selectedAccount && (
        <Box mt={2} textAlign="center">
          <Button variant="contained" color="primary" onClick={() => router.push('/new')}>
            New Picture Bounty
          </Button>
        </Box>
      )}
      <Box mt={2}>
        <BountyList />
      </Box>
    </Box>
  )
}

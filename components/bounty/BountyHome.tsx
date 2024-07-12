import React from 'react'
import { Button, Box } from '@mui/material'
import { useWallet } from '@/hooks/useWallet'
import { SelectedWallet } from '@/components/wallet'
import { BountyList } from './BountyList'
import Link from 'next/link'

export const BountyHome: React.FC = () => {
  const { selectedWallet, selectedAccount } = useWallet()

  return (
    <Box p={2}>
      <SelectedWallet />
      {selectedWallet && selectedAccount && (
        <Box mt={2} textAlign="center">
          <Link href="/bounty/new" passHref>
            <Button variant="contained" color="primary">
              New Picture Bounty
            </Button>
          </Link>
        </Box>
      )}
      <Box mt={2}>
        <BountyList />
      </Box>
    </Box>
  )
}

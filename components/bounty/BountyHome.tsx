import React from 'react'
import Link from 'next/link'
import { Button, Box } from '@mui/material'
import { useWallet } from '@/hooks/useWallet'
import { BountyList } from './BountyList'

export const BountyHome: React.FC = () => {
  const { selectedWallet, selectedAccount } = useWallet()

  return (
    <div>
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
    </div>
  )
}

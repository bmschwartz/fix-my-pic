import React from 'react'
import Link from 'next/link'
import { Button, Box } from '@mui/material'
import { useWallet } from '@/hooks/useWallet'
import { PictureRequestList } from './PictureRequestList'

export const PictureRequestHome: React.FC = () => {
  const { selectedWallet, selectedAccount } = useWallet()

  return (
    <div>
      {selectedWallet && selectedAccount && (
        <Box mt={2} textAlign="center">
          <Link href="/request/new" passHref>
            <Button variant="contained" color="primary">
              New Request
            </Button>
          </Link>
        </Box>
      )}
      <Box mt={2}>
        <PictureRequestList />
      </Box>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { Button, Box } from '@mui/material'
import { useWallet } from '@/hooks/useWallet'
import { ImageRequestList } from './ImageRequestList'

export const ImageRequestHome: React.FC = () => {
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
        <ImageRequestList />
      </Box>
    </div>
  )
}

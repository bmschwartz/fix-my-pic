'use client'

import { NewBountyForm } from './NewBountyForm'
import { BountyList } from './BountyList'
import { useWallet } from '@/hooks/useWallet'

export const BountyHomeContainer = () => {
  const { selectedWallet } = useWallet()

  return (
    <div className="flex h-full space-x-20 mx-10">
      {selectedWallet && <NewBountyForm className="w-1/3" />}
      <BountyList className={selectedWallet ? 'w-2/3' : 'w-full'} />
    </div>
  )
}

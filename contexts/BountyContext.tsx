import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { Bounty } from '@/types/bounty'
import { getPictureBountyApi } from '@/utils/bountyApi'

export interface BountyContextType {
  createBounty: (bountyData: CreateBountyProps) => Promise<Bounty>
  getPictureBounties: () => Promise<Bounty[]>
  getPictureBounty: (address: string) => Promise<Bounty | undefined>
}

interface BountyProviderProps {
  children: ReactNode
}

interface CreateBountyProps {
  title: string
  description: string
  reward: number
  imageId: string
}

const factoryAddress = process.env.NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS
const providerRpcUrl = process.env.NEXT_PUBLIC_RPC_URL

if (!factoryAddress || factoryAddress === '') {
  throw new Error('Factory contract address is not set or is empty')
}
if (!providerRpcUrl || providerRpcUrl === '') {
  throw new Error('Provider RPC URL is not set or is empty')
}

export const BountyContext = createContext<BountyContextType | undefined>(undefined)

export const BountyProvider = ({ children }: BountyProviderProps) => {
  const { selectedAccount, selectedWallet } = useWallet()
  const [bounties, setBounties] = useState<Bounty[]>([])

  useEffect(() => {
    async function fetchBounties() {
      const { getPictureBounties } = await getPictureBountyApi()
      setBounties(getPictureBounties())
    }
    fetchBounties()
  }, [])

  const getPictureBounty = async (address: string): Promise<Bounty | undefined> => {
    const { getPictureBounty } = await getPictureBountyApi()
    return getPictureBounty({ address })
  }

  const getPictureBounties = async (): Promise<Bounty[]> => {
    const { getPictureBounties } = await getPictureBountyApi()
    return getPictureBounties()
  }

  const createBounty = async (bountyData: CreateBountyProps): Promise<Bounty> => {
    if (!selectedWallet || !selectedAccount) {
      throw new Error('Wallet and account needed to create a bounty!')
    }
    const { createPictureBounty } = await getPictureBountyApi()

    const { title, description, imageId, reward } = bountyData

    const bounty = await createPictureBounty({
      wallet: selectedWallet,
      address: selectedAccount,
      bountyData: { title, description, imageId, reward },
    })

    setBounties([...bounties, bounty].filter(Boolean))

    return bounty
  }

  return (
    <BountyContext.Provider value={{ createBounty, getPictureBounty, getPictureBounties }}>
      {children}
    </BountyContext.Provider>
  )
}

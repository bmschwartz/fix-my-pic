import React, { ReactNode, createContext, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { Bounty } from '@/types/bounty'
import { PictureBountyApi } from '@/utils/pictureBountyApi'

export interface BountyContextType {
  createBounty: (bountyData: CreateBountyProps) => Promise<Bounty>
  getPictureBounties: () => Promise<Bounty[]>
  getPictureBounty: (address: string) => Promise<Bounty | undefined>
  bounties: Bounty[]
}

interface BountyProviderProps {
  children: ReactNode
  pictureBountyApi: PictureBountyApi
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

export const BountyProvider = ({ children, pictureBountyApi }: BountyProviderProps) => {
  const { selectedAccount, selectedWallet } = useWallet()
  const [bounties, setBounties] = useState<Bounty[]>([])

  useEffect(() => {
    setBounties(pictureBountyApi.getPictureBounties())
  }, [])

  const getPictureBounty = async (address: string): Promise<Bounty | undefined> => {
    return pictureBountyApi.getPictureBounty({ address })
  }

  const getPictureBounties = async (): Promise<Bounty[]> => {
    return pictureBountyApi.getPictureBounties()
  }

  const createBounty = async (bountyData: CreateBountyProps): Promise<Bounty> => {
    if (!selectedWallet || !selectedAccount) {
      throw new Error('Wallet and account needed to create a bounty!')
    }

    const { title, description, imageId, reward } = bountyData

    const bounty = await pictureBountyApi.createPictureBounty({
      wallet: selectedWallet,
      address: selectedAccount,
      bountyData: { title, description, imageId, reward },
    })

    setBounties([...bounties, bounty].filter(Boolean))

    return bounty
  }

  return (
    <BountyContext.Provider
      value={{ createBounty, getPictureBounty, getPictureBounties, bounties }}
    >
      {children}
    </BountyContext.Provider>
  )
}

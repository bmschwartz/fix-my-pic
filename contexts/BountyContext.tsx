import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ContractTransactionReceipt, ethers } from 'ethers'
import { BrowserProvider, Contract } from 'zksync-ethers'

import { useWallet } from '@/hooks/useWallet'
import { Bounty } from '@/types/bounty'

export interface BountyContextType {
  bounties: Bounty[]
  createBounty: (bountyData: CreateBountyProps) => Promise<Bounty>
}

interface BountyProviderProps {
  children: ReactNode
}

interface CreateBountyProps {
  title: string
  description: string
  reward: string
  imageId: string
  creatorWallet?: string
}

interface PostCreateBountyProps {
  title: string
  description: string
  reward: string
  imageId: string
}

const factoryAddress = process.env.NEXT_PUBLIC_BOUNTY_FACTORY_ADDRESS

if (!factoryAddress || factoryAddress === '') {
  throw new Error('Factory contract address is not set or is empty')
}

export const BountyContext = createContext<BountyContextType | undefined>(undefined)

export const BountyProvider = ({ children }: BountyProviderProps) => {
  const { selectedAccount, selectedWallet } = useWallet()
  const [bounties, setBounties] = useState<Bounty[]>([])

  useEffect(() => {
    refreshBounties()
  }, [])

  const refreshBounties = useCallback(async () => {
    try {
      const bountyList = await _getBounties()
      setBounties(bountyList)
    } catch (e) {
      console.log('[DEBUG] BountyContext: failed to fetch bounties', e)
    }
  }, [])

  const createBounty = async (bountyData: CreateBountyProps): Promise<Bounty> => {
    const bounty = await _postCreateBounty(bountyData)

    setBounties([...bounties, bounty].filter(Boolean))

    return bounty
  }

  const _postCreateBounty = async (bountyData: PostCreateBountyProps): Promise<Bounty> => {
    const { title, description, imageId, reward } = bountyData

    const provider = new BrowserProvider(selectedWallet!.provider)
    const signer = await provider.getSigner(selectedAccount!)

    const {
      data: { abi: bountyFactoryABI },
    } = await axios.get('/artifacts/PictureBountyFactory.json')

    const factoryContract = new Contract(factoryAddress, bountyFactoryABI, signer)
    const rewardInWei = ethers.parseEther(reward)

    try {
      const tx = await factoryContract.createPictureBounty(title, description, imageId, {
        value: rewardInWei,
      })
      const receipt: ContractTransactionReceipt = await tx.wait()

      if (receipt.status !== 1) {
        throw new Error('Failed to create bounty')
      }

      const bountyAddress = receipt.contractAddress

      const {
        data: { bounty },
      } = await axios.get(`/api/bounty/${bountyAddress}`)

      return bounty
    } catch (error) {
      console.error('Unable to create the bounty:', error)
      throw error
    }
  }

  const _getBounties = async (): Promise<Bounty[]> => {
    const response = await axios.get('/api/bounty', {
      params: { filters: {} },
    })

    if (response.status !== 200) {
      throw new Error('Failed to create bounty')
    }

    return response.data.bounties
  }

  return (
    <BountyContext.Provider value={{ createBounty, bounties }}>{children}</BountyContext.Provider>
  )
}

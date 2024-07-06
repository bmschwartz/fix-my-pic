import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { BrowserProvider, Contract } from 'zksync-ethers'

import { useWallet } from '@/hooks/useWallet'
import { Bounty, BountyStatus } from '@/types/bounty'

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

    // Optimistic update
    setBounties([...bounties, bounty])

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

    console.log(bountyFactoryABI)
    console.log('DEBUG inputs: ', title, description, imageId, { value: rewardInWei })
    try {
      // const gasPrice = await provider.getGasPrice()
      const tx = await factoryContract.createPictureBounty.populateTransaction(
        title,
        description,
        imageId,
        {
          value: rewardInWei,
        }
      )

      const sentTx = await signer.sendTransaction(tx)

      console.log(`Transaction Hash: ${sentTx.hash}`)

      const receipt = await sentTx.wait()

      if (receipt.status !== 1) {
        throw new Error('Failed to create bounty')
      }

      const bountyAddress = receipt.hash

      console.log(`DEBUG _postCreateBounty: /api/bounty/${bountyAddress}`)
      const {
        data: { bounty },
      }: { data: { bounty: Bounty } } = await axios.get(`/api/bounty/${bountyAddress}`)
      console.log(`DEBUG _postCreateBounty: got bounty ${bounty.address}`)
      return bounty
    } catch (error) {
      console.error('Unable to create the bounty:', error)
      throw error
    }

    // const newBounty: Bounty = {
    //   address: tx.hash,
    //   title,
    //   description,
    //   imageId,
    //   reward,
    //   status: BountyStatus.NEW,
    // }

    // console.log(`DEBUG created tx for bounty ${newBounty}`)

    // return newBounty
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

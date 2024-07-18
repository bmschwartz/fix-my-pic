import React, { ReactNode, createContext, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { ImageRequest } from '@/types/imageRequest'
import { ImageRequestApi } from '@/utils/imageRequestApi'

export interface ImageRequestContextType {
  createImageRequest: (bountyData: CreateImageRequestProps) => Promise<ImageRequest>
  getImageRequests: () => Promise<ImageRequest[]>
  getImageRequest: (address: string) => Promise<ImageRequest | undefined>
  imageRequests: ImageRequest[]
}

interface BountyProviderProps {
  children: ReactNode
  imageRequestApi: ImageRequestApi
}

interface CreateImageRequestProps {
  title: string
  description: string
  budget: number
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

export const ImageRequestContext = createContext<ImageRequestContextType | undefined>(undefined)

export const BountyProvider = ({ children, imageRequestApi }: BountyProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [imageRequests, setImageRequests] = useState<ImageRequest[]>([])

  useEffect(() => {
    setImageRequests(imageRequestApi.getImageRequests())
  }, [])

  const getImageRequest = async (address: string): Promise<ImageRequest | undefined> => {
    return imageRequestApi.getImageRequest({ address })
  }

  const getImageRequests = async (): Promise<ImageRequest[]> => {
    return imageRequestApi.getImageRequests()
  }

  const createImageRequest = async ({
    title,
    description,
    imageId,
    budget,
  }: CreateImageRequestProps): Promise<ImageRequest> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create an image request!')
    }
    const imageRequest = await imageRequestApi.createImageRequest({
      title,
      description,
      imageId,
      budget,
      wallet,
      account,
    })

    setImageRequests([...imageRequests, imageRequest].filter(Boolean))

    return imageRequest
  }

  return (
    <ImageRequestContext.Provider
      value={{ createImageRequest, getImageRequest, getImageRequests, imageRequests }}
    >
      {children}
    </ImageRequestContext.Provider>
  )
}

import React, { ReactNode, createContext, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureRequest } from '@/types/pictureRequest'
import { PictureRequestApi } from '@/utils/pictureRequestApi'

export interface PictureRequestContextType {
  createPictureRequest: (props: CreatePictureRequestProps) => Promise<PictureRequest>
  getPictureRequests: () => Promise<PictureRequest[]>
  getPictureRequest: (address: string) => Promise<PictureRequest | undefined>
  pictureRequests: PictureRequest[]
}

interface PictureRequestProviderProps {
  children: ReactNode
  pictureRequestApi: PictureRequestApi
}

interface CreatePictureRequestProps {
  title: string
  description: string
  budget: number
  imageId: string
}

const factoryAddress = process.env.NEXT_PUBLIC_PICTURE_REQUEST_FACTORY_ADDRESS
const providerRpcUrl = process.env.NEXT_PUBLIC_RPC_URL

if (!factoryAddress || factoryAddress === '') {
  throw new Error('Factory contract address is not set or is empty')
}
if (!providerRpcUrl || providerRpcUrl === '') {
  throw new Error('Provider RPC URL is not set or is empty')
}

export const PictureRequestContext = createContext<PictureRequestContextType | undefined>(undefined)

export const PictureRequestProvider = ({
  children,
  pictureRequestApi,
}: PictureRequestProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [pictureRequests, setPictureRequests] = useState<PictureRequest[]>([])

  useEffect(() => {
    setPictureRequests(pictureRequestApi.getPictureRequests())
  }, [])

  const getPictureRequest = async (address: string): Promise<PictureRequest | undefined> => {
    return pictureRequestApi.getPictureRequest({ address })
  }

  const getPictureRequests = async (): Promise<PictureRequest[]> => {
    return pictureRequestApi.getPictureRequests()
  }

  const createPictureRequest = async ({
    title,
    description,
    imageId,
    budget,
  }: CreatePictureRequestProps): Promise<PictureRequest> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create an image request!')
    }
    const pictureRequest = await pictureRequestApi.createPictureRequest({
      title,
      description,
      imageId,
      budget,
      wallet,
      account,
    })

    setPictureRequests([...pictureRequests, pictureRequest].filter(Boolean))

    return pictureRequest
  }

  return (
    <PictureRequestContext.Provider
      value={{ createPictureRequest, getPictureRequest, getPictureRequests, pictureRequests }}
    >
      {children}
    </PictureRequestContext.Provider>
  )
}

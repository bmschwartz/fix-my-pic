import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { ImageRequest } from '@/types/imageRequest'
import { ImageRequestApi } from '@/utils/imageRequestApi'
import { ImageRequestSubmission } from '@/types/submission'

export interface RequestSubmissionContextType {
  getRequestSubmissions: (requestAddress: string) => Promise<ImageRequestSubmission[]>
  createSubmission: (submissionData: CreateSubmissionProps) => Promise<ImageRequestSubmission>
}

interface RequestSubmissionProviderProps {
  children: ReactNode
  imageRequestApi: ImageRequestApi
}

interface CreateSubmissionProps {
  requestAddress: string
  description: string
  imageId: string
  price: number
}

export const RequestSubmissionContext = createContext<RequestSubmissionContextType | undefined>(
  undefined
)

export const RequestSubmissionProvider = ({
  children,
  imageRequestApi,
}: RequestSubmissionProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [submissions, setSubmissions] = useState<Record<string, ImageRequestSubmission[]>>({})

  useEffect(() => {
    async function _initSubmissions() {
      const allImageRequests = imageRequestApi.getImageRequests()
      const allSubmissions: Record<string, ImageRequestSubmission[]> = {}

      allImageRequests.forEach((request: ImageRequest) => {
        allSubmissions[request.address] = request.submissions
      })

      setSubmissions(allSubmissions)
    }
    _initSubmissions()
  }, [])

  const _refreshSubmissions = async (requestAddress: string) => {
    const requestSubmissions = await imageRequestApi.getSubmissions({
      requestAddress,
      refetch: true,
    })

    setSubmissions((current: Record<string, ImageRequestSubmission[]>) => ({
      ...current,
      [requestAddress]: requestSubmissions,
    }))

    return requestSubmissions
  }

  const getRequestSubmissions = useCallback(
    async (requestAddress: string) => {
      if (!submissions[requestAddress]) {
        try {
          return _refreshSubmissions(requestAddress)
        } catch (e) {
          console.error(e)
        }
      }
      return submissions[requestAddress] || []
    },
    [submissions]
  )

  const createSubmission = async ({
    description,
    requestAddress,
    imageId,
    price,
  }: CreateSubmissionProps): Promise<ImageRequestSubmission> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create a submission!')
    }

    const submission = await imageRequestApi.createSubmission({
      wallet,
      account,
      requestAddress,
      description,
      imageId,
      price,
    })

    await _refreshSubmissions(requestAddress)

    return submission
  }

  return (
    <RequestSubmissionContext.Provider value={{ getRequestSubmissions, createSubmission }}>
      {children}
    </RequestSubmissionContext.Provider>
  )
}

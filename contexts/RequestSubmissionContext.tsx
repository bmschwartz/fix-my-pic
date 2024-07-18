import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureRequest } from '@/types/pictureRequest'
import { PictureRequestApi } from '@/utils/pictureRequestApi'
import { PictureRequestSubmission } from '@/types/submission'

export interface RequestSubmissionContextType {
  getRequestSubmissions: (requestAddress: string) => Promise<PictureRequestSubmission[]>
  createSubmission: (submissionData: CreateSubmissionProps) => Promise<PictureRequestSubmission>
}

interface RequestSubmissionProviderProps {
  children: ReactNode
  pictureRequestApi: PictureRequestApi
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
  pictureRequestApi,
}: RequestSubmissionProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [submissions, setSubmissions] = useState<Record<string, PictureRequestSubmission[]>>({})

  useEffect(() => {
    async function _initSubmissions() {
      const allPictureRequests = pictureRequestApi.getPictureRequests()
      const allSubmissions: Record<string, PictureRequestSubmission[]> = {}

      allPictureRequests.forEach((request: PictureRequest) => {
        allSubmissions[request.address] = request.submissions
      })

      setSubmissions(allSubmissions)
    }
    _initSubmissions()
  }, [])

  const _refreshSubmissions = async (requestAddress: string) => {
    const requestSubmissions = await pictureRequestApi.getSubmissions({
      requestAddress,
      refetch: true,
    })

    setSubmissions((current: Record<string, PictureRequestSubmission[]>) => ({
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
  }: CreateSubmissionProps): Promise<PictureRequestSubmission> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create a submission!')
    }

    const submission = await pictureRequestApi.createSubmission({
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

import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureRequest } from '@/types/pictureRequest'
import { PictureRequestApi } from '@/utils/pictureRequestApi'
import { PictureRequestSubmission } from '@/types/submission'
import { BigNumberish } from 'ethers'
import axios from 'axios'

export interface RequestSubmissionContextType {
  purchaseSubmission: (submissionAddress: string) => Promise<BigNumberish>
  getRequestSubmissions: (requestAddress: string) => Promise<PictureRequestSubmission[]>
  createSubmission: (submissionData: CreateSubmissionProps) => Promise<PictureRequestSubmission>
}

interface RequestSubmissionProviderProps {
  children: ReactNode
  pictureRequestApi: PictureRequestApi
}

interface CreateSubmissionProps {
  price: number
  description: string
  requestAddress: string
  originalPictureId: string
  watermarkedPictureId?: string
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
      console.log('Got submissions', submissions[requestAddress])
      return submissions[requestAddress] || []
    },
    [submissions]
  )

  const createSubmission = async ({
    price,
    description,
    requestAddress,
    originalPictureId,
    watermarkedPictureId,
  }: CreateSubmissionProps): Promise<PictureRequestSubmission> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create a submission!')
    }

    let encryptedPictureId: string | undefined
    if (watermarkedPictureId) {
      const { data } = await axios.post('/api/pinata/encrypt', { pictureId: originalPictureId })
      encryptedPictureId = data.encryptedPictureId
    }
    const freePictureId = price === 0 ? originalPictureId : undefined

    console.log('Create from context', {
      price,
      wallet,
      account,
      requestAddress,
      description,
      freePictureId,
      encryptedPictureId,
      watermarkedPictureId,
    })

    const submission = await pictureRequestApi.createSubmission({
      price,
      wallet,
      account,
      requestAddress,
      description,
      freePictureId,
      encryptedPictureId,
      watermarkedPictureId,
    })

    await _refreshSubmissions(requestAddress)

    return submission
  }

  const purchaseSubmission = async (submissionAddress: string): Promise<string> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create a submission!')
    }

    console.log('<BEFORE> Getting submission pictureId', account, submissionAddress)
    let pictureId = await pictureRequestApi.getSubmissionPictureId({
      account,
      wallet,
      address: submissionAddress,
    })
    console.log('<BEFORE> pictureId', pictureId)

    await pictureRequestApi.purchaseSubmission({
      address: submissionAddress,
      wallet,
      account,
    })

    console.log('<AFTER> Getting pictueId for account', account, submissionAddress)
    pictureId = await pictureRequestApi.getSubmissionPictureId({
      account,
      wallet,
      address: submissionAddress,
    })
    console.log('<AFTER> pictureId', pictureId)
    return pictureId
  }

  return (
    <RequestSubmissionContext.Provider
      value={{ getRequestSubmissions, createSubmission, purchaseSubmission }}
    >
      {children}
    </RequestSubmissionContext.Provider>
  )
}

import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureRequest } from '@/types/pictureRequest'
import { PictureRequestApi } from '@/utils/pictureRequestApi'
import { PictureRequestSubmission } from '@/types/submission'
import { BigNumberish } from 'ethers'
import axios from 'axios'
import { SubmissionPurchase } from '@/types/purchase'

export interface PurchaseManagerContextType {
  purchaseSubmission: (submissionAddress: string) => Promise<BigNumberish>
  getRequestSubmissions: (requestAddress: string) => Promise<PictureRequestSubmission[]>
  getPurchasesForSubmission: (submissionAddress: string) => Promise<SubmissionPurchase[]>
  createSubmission: (submissionData: CreateSubmissionProps) => Promise<PictureRequestSubmission>
}

interface PurchaseManagerProviderProps {
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

export const PurchaseManagerContext = createContext<PurchaseManagerContextType | undefined>(
  undefined
)

export const PurchaseManagerProvider = ({
  children,
  pictureRequestApi,
}: PurchaseManagerProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [submissionPurchases, setSubmissionPurchases] = useState<
    Record<string, SubmissionPurchase>
  >({})

  useEffect(() => {
    async function _initPurchases() {
      if (!wallet || !account) {
        return
      }

      const allPurchases = await pictureRequestApi.getPurchasesForAccount({ account, wallet })
      const allSubmissionPurchases: Record<string, SubmissionPurchase[]> = {}

      allPurchases.forEach((purchase: SubmissionPurchase) => {
        if (!(purchase.submissionAddress in allSubmissionPurchases)) {
          allSubmissionPurchases[purchase.submissionAddress] = []
        }
        allSubmissionPurchases[purchase.submissionAddress].push(purchase)
      })

      setSubmissionPurchases(allSubmissionPurchases)
    }
    _initPurchases()
  }, [account, wallet])

  const _refreshPurchases = async (submissionAddress: string) => {
    const submission = await pictureRequestApi.getSubmission({
      refetch: true,
      address: submissionAddress,
    })

    setSubmissionPurchases((current: Record<string, SubmissionPurchase[]>) => ({
      ...current,
      [submissionAddress]: submission.purchases,
    }))

    return submissionPurchases
  }

  const getSubmissionPurchases = useCallback(
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

  const getPurchasesForSubmission = async (submissionAddress: string) => {
    await pictureRequestApi.getPurchasesForAddress()
  }

  return (
    <PurchaseManagerContext.Provider
      value={{ getRequestSubmissions, createSubmission, purchaseSubmission }}
    >
      {children}
    </PurchaseManagerContext.Provider>
  )
}

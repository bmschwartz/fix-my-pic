import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { SubmissionPurchase } from '@/types/purchase'
import { PictureRequestApi } from '@/utils/pictureRequestApi'

export interface PurchaseManagerContextType {
  purchases: SubmissionPurchase[]
  purchaseSubmission: (submissionAddress: string) => Promise<SubmissionPurchase>
  getPurchaseBySubmission: (submissionAddress: string) => SubmissionPurchase | undefined
}

interface PurchaseManagerProviderProps {
  children: ReactNode
  pictureRequestApi: PictureRequestApi
}

export const PurchaseManagerContext = createContext<PurchaseManagerContextType | undefined>(
  undefined
)

export const PurchaseManagerProvider = ({
  children,
  pictureRequestApi,
}: PurchaseManagerProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [purchases, setPurchases] = useState<SubmissionPurchase[]>([])
  const [purchasesBySubmission, setPurchasesBySubmission] = useState<
    Record<string, SubmissionPurchase>
  >({})

  useEffect(() => {
    async function _initPurchases() {
      await _refreshPurchases()
    }
    _initPurchases()
  }, [account, wallet])

  const _refreshPurchases = async () => {
    if (!wallet || !account) {
      return
    }

    const allPurchases = await pictureRequestApi.getPurchasesForAccount({ account, wallet })
    setPurchases(allPurchases)

    const allSubmissionPurchases: Record<string, SubmissionPurchase> = {}
    allPurchases.forEach((purchase: SubmissionPurchase) => {
      allSubmissionPurchases[purchase.submissionAddress] = purchase
    })

    setPurchasesBySubmission(allSubmissionPurchases)
  }

  const purchaseSubmission = useCallback(
    async (submissionAddress: string): Promise<SubmissionPurchase> => {
      if (!wallet || !account) {
        throw new Error('Wallet and account needed to create a submission!')
      }

      return pictureRequestApi.purchaseSubmission({
        address: submissionAddress,
        wallet,
        account,
      })
    },
    []
  )

  const getPurchaseBySubmission = (submissionAddress: string): SubmissionPurchase | undefined => {
    return purchasesBySubmission[submissionAddress]
  }

  return (
    <PurchaseManagerContext.Provider
      value={{ purchases, getPurchaseBySubmission, purchaseSubmission }}
    >
      {children}
    </PurchaseManagerContext.Provider>
  )
}

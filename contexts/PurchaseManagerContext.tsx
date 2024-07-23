import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { SubmissionPurchase } from '@/types/purchase'
import { PictureRequestApi } from '@/utils/pictureRequestApi'

export interface PurchaseManagerContextType {
  purchases: SubmissionPurchase[]
  purchasesBySubmission: Record<string, SubmissionPurchase>
  purchaseSubmission: (submissionAddress: string) => Promise<SubmissionPurchase>
  getPurchaseForSubmission: (submissionAddress: string) => SubmissionPurchase | undefined
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

    console.log('DEBUG allPurchases', allPurchases)

    const allSubmissionPurchases: Record<string, SubmissionPurchase> = {}
    allPurchases.forEach((purchase: SubmissionPurchase) => {
      allSubmissionPurchases[purchase.submissionAddress] = purchase
    })

    console.log('DEBUG allSubmissionPurchases', allSubmissionPurchases)

    setPurchasesBySubmission(allSubmissionPurchases)
  }

  const purchaseSubmission = useCallback(
    async (submissionAddress: string): Promise<SubmissionPurchase> => {
      if (!wallet || !account) {
        throw new Error('Wallet and account needed to create a submission!')
      }

      console.log('Calling pictureRequestApi.purchaseSubmission')
      const purchase = await pictureRequestApi.purchaseSubmission({
        address: submissionAddress,
        wallet,
        account,
      })
      console.log('Received purchase', purchase)

      await _refreshPurchases()

      return purchase
    },
    []
  )

  const getPurchaseForSubmission = (submissionAddress: string): SubmissionPurchase | undefined => {
    console.log('DEBUG getPurchaseForSubmission', purchasesBySubmission[submissionAddress])
    if (!purchasesBySubmission[submissionAddress]) {
    }
    return purchasesBySubmission[submissionAddress]
  }

  return (
    <PurchaseManagerContext.Provider
      value={{ purchases, purchasesBySubmission, getPurchaseForSubmission, purchaseSubmission }}
    >
      {children}
    </PurchaseManagerContext.Provider>
  )
}

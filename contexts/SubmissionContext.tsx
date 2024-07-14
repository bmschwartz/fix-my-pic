import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureBountyApi } from '@/utils/pictureBountyApi'
import { BountySubmission } from '@/types/submission'
import { Bounty } from '@/types/bounty'

export interface SubmissionContextType {
  fetchSubmissions: (bountyAddress: string) => Promise<BountySubmission[]>
  createSubmission: (submissionData: CreateSubmissionProps) => Promise<BountySubmission>
}

interface SubmissionProviderProps {
  children: ReactNode
  pictureBountyApi: PictureBountyApi
}

interface CreateSubmissionProps {
  bountyAddress: string
  description: string
  imageId: string
}

export const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined)

export const SubmissionProvider = ({ children, pictureBountyApi }: SubmissionProviderProps) => {
  const { selectedAccount: account, selectedWallet: wallet } = useWallet()
  const [submissions, setSubmissions] = useState<Record<string, BountySubmission[]>>({})

  useEffect(() => {
    async function _initSubmissions() {
      const allBounties = pictureBountyApi.getPictureBounties()
      const allSubmissions: Record<string, BountySubmission[]> = {}

      allBounties.forEach((bounty: Bounty) => {
        allSubmissions[bounty.address] = bounty.submissions
      })

      setSubmissions(allSubmissions)
    }
    _initSubmissions()
  }, [])

  const fetchSubmissions = useCallback(async (bountyAddress: string) => {
    try {
      return await pictureBountyApi.getSubmissions({ bountyAddress, refetch: true })
    } catch (err: any) {
      throw new Error(err.message)
    }
  }, [])

  const createSubmission = async ({
    description,
    bountyAddress,
    imageId,
  }: CreateSubmissionProps): Promise<BountySubmission> => {
    if (!wallet || !account) {
      throw new Error('Wallet and account needed to create a submission!')
    }

    const submission = await pictureBountyApi.createSubmission({
      wallet,
      account,
      bountyAddress,
      description,
      imageId,
    })

    const bountySubmissions = await pictureBountyApi.getSubmissions({
      bountyAddress,
      refetch: true,
    })

    setSubmissions((current: Record<string, BountySubmission[]>) => ({
      ...current,
      [bountyAddress]: bountySubmissions,
    }))

    return submission
  }

  return (
    <SubmissionContext.Provider value={{ fetchSubmissions, createSubmission }}>
      {children}
    </SubmissionContext.Provider>
  )
}

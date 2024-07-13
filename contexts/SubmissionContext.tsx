import React, { ReactNode, createContext, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/useWallet'
import { PictureBountyApi } from '@/utils/pictureBountyApi'
import { BountySubmission } from '@/types/submission'
import { Bounty } from '@/types/bounty'

export interface SubmissionContextType {
  submissions: Record<string, BountySubmission[]>
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
  const { selectedAccount, selectedWallet } = useWallet()
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

  const createSubmission = async ({
    description,
    bountyAddress,
    imageId,
  }: CreateSubmissionProps): Promise<BountySubmission> => {
    if (!selectedWallet || !selectedAccount) {
      throw new Error('Wallet and account needed to create a bounty!')
    }

    const submission = await pictureBountyApi.createSubmission({
      wallet: selectedWallet,
      address: selectedAccount,
      submissionData: {
        bountyAddress,
        description,
        imageId,
      },
    })

    const bountySubmissions = await pictureBountyApi.getSubmissions({
      bountyAddress,
      refetch: false,
    })

    setSubmissions((current: Record<string, BountySubmission[]>) => ({
      ...current,
      bountyAddress: bountySubmissions,
    }))

    return submission
  }

  return (
    <SubmissionContext.Provider value={{ submissions, createSubmission }}>
      {children}
    </SubmissionContext.Provider>
  )
}

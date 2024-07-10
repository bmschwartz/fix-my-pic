import { BountySubmission } from './submission'

export enum BountyState {
  NEW,
  FUNDED,
  ACCEPTING_SUBMISSIONS,
  PAID_OUT,
}

export interface Bounty {
  address: string
  title: string
  description: string
  imageId: string
  reward: number
  state: BountyState
  submissions: BountySubmission[]
}

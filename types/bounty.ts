import { BountySubmission } from './submission'

export enum BountyState {
  ACTIVE,
  COMPLETED,
  CANCELLED,
}

export interface Bounty {
  owner: string
  address: string
  title: string
  description: string
  imageId: string
  reward: number
  state: BountyState
  submissions: BountySubmission[]
}

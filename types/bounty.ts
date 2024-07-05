export enum BountyStatus {
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
  reward?: number
  creatorWallet?: string
  refundWallet?: string
  status?: BountyStatus
}

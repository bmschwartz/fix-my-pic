import { SubmissionPurchase } from './purchase'

export interface PictureRequestSubmission {
  price: number
  address: string
  submitter: string
  description: string
  freePictureUrl?: string
  encryptedPictureUrl?: string
  watermarkedPictureUrl?: string
  purchases: SubmissionPurchase[]
}

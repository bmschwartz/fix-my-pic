export interface PictureRequestSubmission {
  price: number
  address: string
  submitter: string
  description: string
  purchasers: string[]
  freePictureId?: string
  encryptedPictureId?: string
  watermarkedPictureId?: string
}

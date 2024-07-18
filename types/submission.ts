export interface BountySubmission {
  submitter: string
  address: string
  description: string
  imageId: string
  isWinner: boolean
}

export interface PictureRequestSubmission {
  submitter: string
  address: string
  description: string
  imageId: string
  imageUrl: string
  price: number
}

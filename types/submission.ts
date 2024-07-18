export interface BountySubmission {
  submitter: string
  address: string
  description: string
  imageId: string
  isWinner: boolean
}

export interface ImageRequestSubmission {
  submitter: string
  address: string
  description: string
  imageId: string
  price: number
}

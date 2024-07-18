import { ImageRequestSubmission } from './submission'

export interface ImageRequest {
  address: string
  title: string
  description: string
  imageId: string
  budget: number
  imageUrl: string
  submissions: ImageRequestSubmission[]
}

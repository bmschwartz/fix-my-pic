import { PictureRequestSubmission } from './submission'

export interface PictureRequest {
  address: string
  title: string
  description: string
  imageId: string
  budget: number
  imageUrl: string
  submissions: PictureRequestSubmission[]
}

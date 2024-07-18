import { ImageRequestSubmission } from './submission'

export enum ImageRequestState {
  ACTIVE,
  COMPLETED,
  CANCELLED,
}

export interface ImageRequest {
  owner: string
  address: string
  title: string
  description: string
  imageId: string
  budget: number
  state: ImageRequestState
  submissions: ImageRequestSubmission[]
}

import { SubmissionPurchase } from './purchase';

export interface RequestSubmission {
  id: string;
  price: number;
  ipfsHash: string;
  createdAt: number;
  submitter: string;
  description: string;
  freePictureId?: string;
  encryptedPictureId?: string;
  watermarkedPictureId?: string;
  purchases: SubmissionPurchase[];
}

export type PartialRequestSubmission = Partial<RequestSubmission>;

export interface SubmissionPurchase {
  id: string;
  buyer: string;
  price: number;
  purchaseDate: number;
  submissionAddress: string;
  encryptedPictureId?: string;
  submissionDescription?: string;
}

export type PartialSubmissionPurchase = Partial<SubmissionPurchase>;

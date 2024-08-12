import { RequestComment } from '@/types/comment';
import { SubmissionPurchase } from '@/types/purchase';
import { Request } from '@/types/request';
import { RequestSubmission } from '@/types/submission';

import type { SubmissionPurchase as GqlSubmissionPurchase } from '@/graphql/client';

const mapSubmissionPurchase = (
  purchase: GqlSubmissionPurchase,
  submissionAddress: string,
  price: string
): SubmissionPurchase => {
  return {
    id: purchase.id,
    buyer: purchase.purchaser,
    price: Number(price) / 100,
    submissionAddress,
    purchaseDate: Number(purchase.purchaseDate),
  };
};

export const mapRequestComment = (comment: any): RequestComment => {
  return {
    id: comment.id,
    text: comment.text,
    commenter: comment.commenter,
    createdAt: Number(comment.createdAt),
  };
};

export const mapRequestSubmission = (submission: any): RequestSubmission => {
  return {
    id: submission.id,
    price: Number(submission.price) / 100,
    submitter: submission.submitter,
    description: submission.description,
    freePictureId: submission.freeImageId,
    encryptedPictureId: submission.encryptedImageId,
    watermarkedPictureId: submission.watermarkedImageId,
    purchases: (submission.purchases ?? []).map((purchase: GqlSubmissionPurchase) =>
      mapSubmissionPurchase(purchase, submission.id, submission.price)
    ),
    createdAt: Number(submission.createdAt),
  };
};

export const mapPictureRequest = (request: any): Request => {
  return {
    id: request.id,
    title: request.title,
    budget: request.budget / 100, // Convert from cents to dollars
    imageId: request.imageId,
    description: request.description,
  };
};

import { PartialRequestComment } from '@/types/comment';
import { SubmissionPurchase } from '@/types/purchase';
import { PartialRequest } from '@/types/request';
import { PartialRequestSubmission } from '@/types/submission';
import { removeNullishValues } from './object';

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

const mapRequestComment = (comment: any): PartialRequestComment => {
  return removeNullishValues({
    id: comment.id,
    text: comment.text,
    commenter: comment.commenter,
    createdAt: Number(comment.createdAt),
  });
};

const mapRequestSubmission = (submission: any): PartialRequestSubmission => {
  return removeNullishValues({
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
  });
};

export const mapPictureRequest = (request: any): PartialRequest => {
  return removeNullishValues({
    id: request.id,
    title: request.title,
    budget: request.budget / 100, // Convert from cents to dollars
    creator: request.creator,
    imageId: request.imageId,
    createdAt: Number(request.createdAt),
    expiresAt: Number(request.expiresAt),
    description: request.description,
    comments: (request.comments ?? []).map(mapRequestComment),
    submissions: (request.submissions ?? []).map(mapRequestSubmission),
  });
};

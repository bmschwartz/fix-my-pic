import { useState } from 'react';

import { execute, GetRequestCommentDocument, GetRequestCommentsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestCommentParams as ContractCreateCommentParams } from '@/services/contractService';
import { delay } from '@/utils/delay';
import { mapRequestComment } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

interface CreateRequestCommentParams extends Omit<ContractCreateCommentParams, 'requestAddress' | 'ipfsHash'> {
  text: string;
  requestId: string;
}

export const useComments = () => {
  const { fetchIPFSData } = useIpfs();
  const { uploadRequestComment } = useIpfs();
  const { contractService } = useContractService();

  const [loading, setLoading] = useState<boolean>(false);

  const loadIPFSAndTransform = async (comment: any) => {
    const ipfsData = await fetchIPFSData(comment.ipfsHash);
    return { ...comment, ...ipfsData };
  };

  const fetchComments = async (requestId: string) => {
    const result = await execute(GetRequestCommentsDocument, { requestId });
    const comments = result?.data?.requestComments || [];
    const transformedComments = await Promise.all(comments.map(loadIPFSAndTransform));
    return transformedComments.map(mapRequestComment);
  };

  const pollForNewComment = async (id: string, retries = 10): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      await delay(2000); // Wait before retry

      const result = await execute(GetRequestCommentDocument, { id });
      const comment = result?.data?.requestComment;
      if (comment) {
        return true;
      }
    }
    return false;
  };

  const createRequestComment = async ({
    wallet,
    account,
    requestId,
    text,
  }: CreateRequestCommentParams): Promise<void> => {
    setLoading(true);

    try {
      const ipfsHash = await uploadRequestComment({ text });

      const requestCommentAddress = await contractService.createRequestComment({
        wallet,
        account,
        ipfsHash,
        requestAddress: requestId,
      });

      let created = false;
      if (requestCommentAddress) {
        // Try to fetch data from the subgraph until the new comment appears
        created = await pollForNewComment(requestCommentAddress);
      }

      if (!created) {
        throw new Error('Failed to create request comment');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createRequestComment, fetchComments, loading };
};

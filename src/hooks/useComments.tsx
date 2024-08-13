import { useState } from 'react';

import { execute, GetRequestCommentDocument, GetRequestCommentsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestCommentParams as ContractCreateCommentParams } from '@/services/contractService';
import { pollWithRetry } from '@/utils/delay';
import { mapRequestComment } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

interface CreateRequestCommentParams extends Omit<ContractCreateCommentParams, 'requestAddress' | 'ipfsHash'> {
  text: string;
  requestId: string;
  setStatus?: (status: string) => void;
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

  const pollForNewComment = async (id: string): Promise<void> => {
    return pollWithRetry({
      callback: async () => {
        const result = await execute(GetRequestCommentDocument, { id });
        return result?.data?.requestComment || null;
      },
    });
  };

  const createRequestComment = async ({
    text,
    wallet,
    account,
    requestId,
    setStatus,
  }: CreateRequestCommentParams): Promise<void> => {
    setLoading(true);

    try {
      setStatus?.('Uploading comment...');
      const ipfsHash = await uploadRequestComment({ text });

      setStatus?.('Creating smart contract...');
      const requestCommentAddress = await contractService.createRequestComment({
        wallet,
        account,
        ipfsHash,
        requestAddress: requestId,
      });

      let created = false;
      if (requestCommentAddress) {
        // Try to fetch data from the subgraph until the new comment appears
        setStatus?.('Waiting for confirmation...');
        await pollForNewComment(requestCommentAddress);
        created = true;
      }

      if (!created) {
        throw new Error('Failed to create request comment');
      }
    } finally {
      setStatus?.('');
      setLoading(false);
    }
  };

  return { createRequestComment, fetchComments, loading };
};

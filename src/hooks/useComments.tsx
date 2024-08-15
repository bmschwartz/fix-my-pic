import { execute, GetRequestCommentDocument, GetRequestCommentsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestCommentParams as ContractCreateCommentParams } from '@/services/contractService';
import { RequestComment } from '@/types/comment';
import { pollWithRetry } from '@/utils/delay';
import { mapRequestComment } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

export interface CreateRequestCommentParams extends Omit<ContractCreateCommentParams, 'requestAddress' | 'ipfsHash'> {
  text: string;
  requestId: string;
  setStatus?: (status: string) => void;
}

export const useComments = () => {
  const { contractService } = useContractService();
  const { fetchIPFSData, uploadRequestComment } = useIpfs();

  const loadIPFSAndTransform = async (comment: any) => {
    const ipfsData = await fetchIPFSData(comment.ipfsHash);
    return { ...comment, ...ipfsData };
  };

  const fetchComments = async (requestId: string): Promise<RequestComment[]> => {
    try {
      const result = await execute(GetRequestCommentsDocument, { requestId });
      const comments = result?.data?.requestComments || [];
      const transformedComments = await Promise.all(comments.map(loadIPFSAndTransform));
      return transformedComments.map(mapRequestComment);
    } catch (e) {
      console.error('Error fetching comments:', e);
      return [];
    }
  };

  const pollForNewComment = async (id: string, onCommentFound: (comment: RequestComment) => void): Promise<void> => {
    const fetchedComment = await pollWithRetry({
      callback: async () => {
        const result = await execute(GetRequestCommentDocument, { id });
        return result?.data?.requestComment || null;
      },
    });

    if (!fetchedComment) {
      return;
    }

    const commentWithIpfData = await loadIPFSAndTransform(fetchedComment);
    const finalComment = mapRequestComment(commentWithIpfData);

    onCommentFound(finalComment);
  };

  const createRequestComment = async ({
    text,
    wallet,
    account,
    requestId,
    setStatus,
  }: CreateRequestCommentParams): Promise<RequestComment> => {
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

      if (!requestCommentAddress) {
        throw new Error('Failed to create request comment');
      }

      const optimisticComment: RequestComment = {
        id: requestCommentAddress,
        text,
        commenter: account,
        createdAt: Math.floor(Date.now() / 1000),
      };

      return optimisticComment;
    } finally {
      setStatus?.('');
    }
  };

  return { createRequestComment, fetchComments, pollForNewComment };
};

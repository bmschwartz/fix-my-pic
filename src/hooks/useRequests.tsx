import { useEffect, useState } from 'react';

import { execute, GetPictureRequestDocument, GetPictureRequestsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreatePictureRequestParams as ContractCreateRequestParams } from '@/services/contractService';
import { Request } from '@/types/request';
import { getLogger } from '@/utils/logging';
import { mapPictureRequest } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

interface CreatePictureRequestParams extends Omit<ContractCreateRequestParams, 'ipfsHash'> {
  title: string;
  imageId: string;
  description: string;
}

const logger = getLogger('useRequests');

export const useRequests = () => {
  const { fetchIPFSData, uploadPictureRequest } = useIpfs();
  const { contractService } = useContractService();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRequestComments = async (request: Request) => {
    const commentsWithIPFSData = await Promise.all(
      request.comments.map(async (comment: any) => {
        const commentIpfsData = await fetchIPFSData(comment.ipfsHash);
        return { ...comment, ...commentIpfsData };
      })
    );

    return commentsWithIPFSData;
  };

  const loadRequestSubmissions = async (request: Request) => {
    const submissionsWithIPFSData = await Promise.all(
      request.submissions.map(async (submission: any) => {
        const submissionIpfsData = await fetchIPFSData(submission.ipfsHash);
        return { ...submission, ...submissionIpfsData };
      })
    );

    return submissionsWithIPFSData;
  };

  const loadIPFSAndTransform = async (request: any) => {
    const ipfsData = await fetchIPFSData(request.ipfsHash);

    const [commentsWithIPFSData, submissionsWithIPFSData] = await Promise.all([
      loadRequestComments(request),
      loadRequestSubmissions(request),
    ]);

    logger.info('Loaded IPFS data for request:', request.id, commentsWithIPFSData, submissionsWithIPFSData);

    return mapPictureRequest({
      ...request,
      ...ipfsData,
      comments: commentsWithIPFSData,
      submissions: submissionsWithIPFSData,
    });
  };

  const fetchRequest = async (id: string): Promise<Request | undefined> => {
    const result = await execute(GetPictureRequestDocument, { id });
    const request = result?.data?.pictureRequest;
    if (request) {
      return loadIPFSAndTransform(request);
    }
  };

  const fetchAllRequests = async (): Promise<void> => {
    setLoading(true);
    const result = await execute(GetPictureRequestsDocument, {});
    const pictureRequests = result?.data?.pictureRequests || [];

    const transformedRequests = await Promise.all(pictureRequests.map(loadIPFSAndTransform));

    setRequests(transformedRequests);
    setLoading(false);
  };

  const pollForNewRequest = async (id: string, retries = 10) => {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retry
      const request = await fetchRequest(id);
      logger.info(`Polled for new request with id: ${id} [${i + 1}]:`, request);
      if (request) {
        const transformedRequest = await loadIPFSAndTransform(request);
        setRequests((prevRequests) => [...prevRequests, transformedRequest]);
        break;
      }
    }
  };

  const createPictureRequest = async ({
    title,
    description,
    imageId,
    budget,
    ...otherParams
  }: CreatePictureRequestParams) => {
    setLoading(true);

    try {
      const ipfsHash = await uploadPictureRequest({ title, description, imageId });
      const pictureRequestAddress = await contractService.createPictureRequest({ ipfsHash, budget, ...otherParams });

      if (pictureRequestAddress) {
        // Optimistically update the state
        const newRequest: Request = {
          id: pictureRequestAddress,
          title,
          budget,
          imageId,
          description,
          comments: [],
          submissions: [],
        };

        // Add a placeholder entry in `requests` to show it immediately
        setRequests((prevRequests) => [...prevRequests, newRequest as Request]);

        // Try to fetch data from the subgraph until the new request appears
        await pollForNewRequest(pictureRequestAddress);
      }
    } catch (e) {
      console.error('Error creating picture request:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { requests, createPictureRequest, loading, fetchRequest };
};

import { useEffect, useState } from 'react';

import { execute, GetPictureRequestsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreatePictureRequestParams as ContractCreateRequestParams } from '@/services/contractService';
import { Request } from '@/types/request';
import { mapPictureRequest } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

interface CreatePictureRequestParams extends Omit<ContractCreateRequestParams, 'ipfsHash'> {
  title: string;
  imageId: string;
  description: string;
}

export const useRequests = () => {
  const { fetchIPFSData, uploadPictureRequest } = useIpfs();
  const { contractService } = useContractService();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAndTransformData = async () => {
    setLoading(true);
    const result = await execute(GetPictureRequestsDocument, {});
    const pictureRequests = result?.data?.pictureRequests || [];

    const requestsWithIPFSData = await Promise.all(
      pictureRequests.map(async (request: any) => {
        const ipfsData = await fetchIPFSData(request.ipfsHash);
        const commentsWithIPFSData = await Promise.all(
          request.comments.map(async (comment: any) => {
            const commentIpfsData = await fetchIPFSData(comment.ipfsHash);
            return { ...comment, ...commentIpfsData };
          })
        );
        const submissionsWithIPFSData = await Promise.all(
          request.submissions.map(async (submission: any) => {
            const submissionIpfsData = await fetchIPFSData(submission.ipfsHash);
            return { ...submission, ...submissionIpfsData };
          })
        );

        return mapPictureRequest({
          ...request,
          ...ipfsData,
          comments: commentsWithIPFSData,
          submissions: submissionsWithIPFSData,
        });
      })
    );

    setRequests(requestsWithIPFSData);
    setLoading(false);
  };

  const pollForNewRequest = async (id: string, retries = 10) => {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 seconds
      const newRequests = await execute(GetPictureRequestsDocument, {});
      const found = newRequests?.data?.pictureRequests?.find((r: any) => r.id === id);
      if (found) {
        fetchAndTransformData(); // Refresh the data
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
        setRequests([...requests, newRequest as Request]);

        // Re-fetch data from the subgraph until the new request appears
        await pollForNewRequest(pictureRequestAddress);
      }
    } catch (e) {
      console.error('Error creating picture request:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndTransformData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { requests, createPictureRequest, loading, getRequest: (id: string) => requests.find((r) => r.id === id) };
};

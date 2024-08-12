import { useEffect, useState } from 'react';

import { execute, GetPictureRequestDocument, GetPictureRequestsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreatePictureRequestParams as ContractCreateRequestParams } from '@/services/contractService';
import { Request } from '@/types/request';
import { pollWithRetry } from '@/utils/delay';
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

  const loadIPFSAndTransform = async (request: any) => {
    const ipfsData = await fetchIPFSData(request.ipfsHash);

    return mapPictureRequest({
      ...request,
      ...ipfsData,
    });
  };

  const fetchRequest = async (id: string): Promise<Request | undefined> => {
    setLoading(true);
    try {
      const result = await execute(GetPictureRequestDocument, { id });
      const request = result?.data?.pictureRequest;
      if (request) {
        return loadIPFSAndTransform(request);
      }
    } catch (e) {
      console.error('Error fetching request:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRequests = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await execute(GetPictureRequestsDocument, {});
      const pictureRequests = result?.data?.pictureRequests || [];

      const transformedRequests = await Promise.all(pictureRequests.map(loadIPFSAndTransform));

      setRequests(transformedRequests);
    } catch (e) {
      console.error('Error fetching requests:', e);
    } finally {
      setLoading(false);
    }
  };

  const pollForNewRequest = async (id: string): Promise<void> => {
    const request = await pollWithRetry({
      callback: async () => {
        return fetchRequest(id);
      },
    });

    if (request) {
      const transformedRequest = await loadIPFSAndTransform(request);
      setRequests((prevRequests) => [...prevRequests, transformedRequest]);
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

      let created = false;
      if (pictureRequestAddress) {
        // Optimistically update the state
        const newRequest: Request = {
          id: pictureRequestAddress,
          title,
          budget,
          imageId,
          description,
        };

        // Add a placeholder entry in `requests` to show it immediately
        setRequests((prevRequests) => [...prevRequests, newRequest as Request]);

        // Try to fetch data from the subgraph until the new request appears
        await pollForNewRequest(pictureRequestAddress);
        created = true;
      }

      if (!created) {
        throw new Error('Failed to create picture request');
      }
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

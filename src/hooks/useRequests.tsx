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
  image: File;
  description: string;
  setStatus?: (status: string) => void;
}

export const useRequests = () => {
  const { contractService } = useContractService();
  const { fetchIPFSData, uploadPictureRequest, uploadImage } = useIpfs();

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
    image,
    budget,
    setStatus,
    description,
    ...otherParams
  }: CreatePictureRequestParams) => {
    setLoading(true);

    try {
      setStatus?.('Uploading image...');
      const imageId = await uploadImage({ file: image });

      setStatus?.('Uploading metadata...');
      const ipfsHash = await uploadPictureRequest({ title, description, imageId });

      setStatus?.('Creating smart contract...');
      const pictureRequestAddress = await contractService.createPictureRequest({ ipfsHash, budget, ...otherParams });

      let created = false;
      if (pictureRequestAddress) {
        const newRequest: Request = {
          id: pictureRequestAddress,
          title,
          budget,
          imageId,
          description,
        };

        setRequests((prevRequests) => [...prevRequests, newRequest as Request]);

        setStatus?.('Waiting for confirmation...');
        await pollForNewRequest(pictureRequestAddress);
        created = true;
      }

      if (!created) {
        throw new Error('Failed to create picture request');
      }
    } finally {
      setStatus?.('');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { requests, createPictureRequest, loading, fetchRequest };
};

import { useState } from 'react';

import { execute, GetRequestSubmissionDocument, GetRequestSubmissionsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestSubmissionParams as ContractCreateSubmissionParams } from '@/services/contractService';
import { pollWithRetry } from '@/utils/delay';
import { mapRequestSubmission } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

interface CreateRequestSubmissionParams extends Omit<ContractCreateSubmissionParams, 'requestAddress' | 'ipfsHash'> {
  requestId: string;
  description: string;
  freeImageId: string;
  encryptedImageId: string;
  watermarkedImageId: string;
}

export const useSubmissions = () => {
  const { fetchIPFSData } = useIpfs();
  const { uploadRequestSubmission } = useIpfs();
  const { contractService } = useContractService();

  const [loading, setLoading] = useState<boolean>(false);

  const loadIPFSAndTransform = async (submission: any) => {
    const ipfsData = await fetchIPFSData(submission.ipfsHash);
    return { ...submission, ...ipfsData };
  };

  const fetchSubmissions = async (requestId: string) => {
    const result = await execute(GetRequestSubmissionsDocument, { requestId });
    const submissions = result?.data?.requestSubmissions || [];
    const transformedSubmissions = await Promise.all(submissions.map(loadIPFSAndTransform));
    return transformedSubmissions.map(mapRequestSubmission);
  };

  const pollForNewSubmission = async (id: string): Promise<void> => {
    return pollWithRetry({
      callback: async () => {
        const result = await execute(GetRequestSubmissionDocument, { id });
        return result?.data?.requestSubmission;
      },
    });
  };

  const createRequestSubmission = async ({
    description,
    wallet,
    account,
    price,
    requestId,
    freeImageId,
    encryptedImageId,
    watermarkedImageId,
  }: CreateRequestSubmissionParams) => {
    setLoading(true);

    try {
      const ipfsHash = await uploadRequestSubmission({
        description,
        freeImageId,
        encryptedImageId,
        watermarkedImageId,
      });

      const requestSubmissionAddress = await contractService.createRequestSubmission({
        price,
        wallet,
        account,
        ipfsHash,
        requestAddress: requestId,
      });

      let created = false;
      if (requestSubmissionAddress) {
        // Try to fetch data from the subgraph until the new submission appears
        await pollForNewSubmission(requestSubmissionAddress);
        created = true;
      }

      if (!created) {
        throw new Error('Failed to create request submission');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createRequestSubmission, fetchSubmissions, loading };
};

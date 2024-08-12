import { useState } from 'react';

import { execute, GetRequestSubmissionDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestSubmissionParams as ContractCreateSubmissionParams } from '@/services/contractService';
import { useIpfs } from './useIpfs';

interface CreateRequestSubmissionParams extends Omit<ContractCreateSubmissionParams, 'requestAddress' | 'ipfsHash'> {
  requestId: string;
  description: string;
  freeImageId: string;
  encryptedImageId: string;
  watermarkedImageId: string;
}

export const useSubmissions = () => {
  const { uploadRequestSubmission } = useIpfs();
  const { contractService } = useContractService();

  const [loading, setLoading] = useState<boolean>(false);

  const pollForNewSubmission = async (id: string, retries = 10): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retry
      const result = await execute(GetRequestSubmissionDocument, { id });
      const submission = result?.data?.requestSubmission;
      if (submission) {
        return true;
      }
    }
    return false;
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

      if (requestSubmissionAddress) {
        // Try to fetch data from the subgraph until the new submission appears
        await pollForNewSubmission(requestSubmissionAddress);
      }
    } catch (e) {
      console.error('Error creating request submission:', e);
    } finally {
      setLoading(false);
    }
  };

  return { createRequestSubmission, loading };
};

import { execute, GetRequestSubmissionDocument, GetRequestSubmissionsDocument } from '@/graphql/client';
import { useContractService } from '@/hooks/useContractService';
import { CreateRequestSubmissionParams as ContractCreateSubmissionParams } from '@/services/contractService';
import { RequestSubmission } from '@/types/submission';
import { pollWithRetry } from '@/utils/delay';
import { mapRequestSubmission } from '@/utils/mappers';
import { useIpfs } from './useIpfs';

export interface CreateRequestSubmissionParams
  extends Omit<ContractCreateSubmissionParams, 'requestAddress' | 'ipfsHash'> {
  requestId: string;
  description: string;
  freeImageId: string;
  encryptedImageId: string;
  watermarkedImageId: string;
  setStatus?: (status: string) => void;
}

export const useSubmissions = () => {
  const { contractService } = useContractService();
  const { fetchIPFSData, uploadRequestSubmission } = useIpfs();

  const loadIPFSAndTransform = async (submission: any) => {
    const ipfsData = await fetchIPFSData(submission.ipfsHash);
    return { ...submission, ...ipfsData };
  };

  const fetchSubmissions = async (requestId: string): Promise<RequestSubmission[]> => {
    try {
      const result = await execute(GetRequestSubmissionsDocument, { requestId });
      const submissions = result?.data?.requestSubmissions || [];
      const transformedSubmissions = await Promise.all(submissions.map(loadIPFSAndTransform));
      return transformedSubmissions.map(mapRequestSubmission);
    } catch (e) {
      console.error('Error fetching submissions:', e);
      return [];
    }
  };

  const pollForNewSubmission = async (
    id: string,
    onSubmissionFound: (submission: RequestSubmission) => void
  ): Promise<void> => {
    const fetchedSubmission = await pollWithRetry({
      callback: async () => {
        const result = await execute(GetRequestSubmissionDocument, { id: id.toLowerCase() });
        return result?.data?.requestSubmission;
      },
    });

    if (!fetchedSubmission) {
      return;
    }

    const submissionWithIpfsData = await loadIPFSAndTransform(fetchedSubmission);
    const finalSubmission = mapRequestSubmission(submissionWithIpfsData);

    onSubmissionFound(finalSubmission);
  };

  const createRequestSubmission = async ({
    description,
    wallet,
    account,
    price,
    setStatus,
    requestId,
    freeImageId,
    encryptedImageId,
    watermarkedImageId,
  }: CreateRequestSubmissionParams) => {
    try {
      setStatus?.('Uploading metadata...');
      const ipfsHash = await uploadRequestSubmission({
        description,
        freeImageId,
        encryptedImageId,
        watermarkedImageId,
      });

      setStatus?.('Creating smart contract...');
      const requestSubmissionAddress = await contractService.createRequestSubmission({
        price,
        wallet,
        account,
        ipfsHash,
        requestAddress: requestId,
      });

      if (!requestSubmissionAddress) {
        throw new Error('Failed to create request comment');
      }

      const optimisticSubmission: RequestSubmission = {
        id: requestSubmissionAddress.toLowerCase(),
        price,
        ipfsHash,
        description,
        purchases: [],
        submitter: account,
        freePictureId: freeImageId,
        encryptedPictureId: encryptedImageId,
        watermarkedPictureId: watermarkedImageId,
        createdAt: Math.floor(Date.now() / 1000),
      };

      return optimisticSubmission;
    } finally {
      setStatus?.('');
    }
  };

  return { createRequestSubmission, pollForNewSubmission, fetchSubmissions };
};

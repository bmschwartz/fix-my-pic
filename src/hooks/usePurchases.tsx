import { useCallback, useEffect, useState } from 'react';

import {
  execute,
  GetSubmissionPurchasesForPurchaserDocument,
  SubmissionPurchase as GqlSubmissionPurchase,
} from '@/graphql/client';
import { SubmissionPurchase } from '@/types/purchase';
import { mapSubmissionPurchase } from '@/utils/mappers';
import { useIpfs } from './useIpfs';
import { useWallet } from './useWallet';

export const usePurchases = () => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<SubmissionPurchase[]>([]);
  const { fetchIPFSData } = useIpfs();
  const { selectedAccount } = useWallet();

  const loadIPFSData = useCallback(
    async (purchase: SubmissionPurchase, ipfsHash: string): Promise<SubmissionPurchase> => {
      const ipfsData = await fetchIPFSData(ipfsHash);
      return {
        ...purchase,
        encryptedPictureId: ipfsData.encryptedImageId,
        submissionDescription: ipfsData.description,
      };
    },
    [fetchIPFSData]
  );

  const fetchPurchases = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      const result = await execute(GetSubmissionPurchasesForPurchaserDocument, {
        purchaser: selectedAccount,
      });

      const purchases: GqlSubmissionPurchase[] = result?.data?.submissionPurchases || [];
      const submissionIpfsHashes: Record<string, string> = {};

      purchases.forEach((purchase) => {
        submissionIpfsHashes[purchase.submission.id] = purchase.submission.ipfsHash;
      });

      const formattedPurchases = purchases.map((purchase) =>
        mapSubmissionPurchase(purchase, purchase.submission.id, purchase.price)
      );

      const purchasesWithIpfsData = await Promise.all(
        formattedPurchases.map((purchase) => loadIPFSData(purchase, submissionIpfsHashes[purchase.submissionAddress]))
      );

      setPurchases(purchasesWithIpfsData);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, loadIPFSData]);

  useEffect(() => {
    if (selectedAccount) {
      fetchPurchases();
    }
  }, [selectedAccount, fetchPurchases]);

  return { loading, purchases };
};

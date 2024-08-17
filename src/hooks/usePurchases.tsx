import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { WalletDetail } from '@/contexts/WalletContext';
import {
  execute,
  GetSubmissionPurchasesForPurchaserDocument,
  SubmissionPurchase as GqlSubmissionPurchase,
} from '@/graphql/client';
import { SubmissionPurchase } from '@/types/purchase';
import { RequestSubmission } from '@/types/submission';
import { mapSubmissionPurchase } from '@/utils/mappers';
import { useContractService } from './useContractService';
import { useIpfs } from './useIpfs';
import { useWallet } from './useWallet';

export interface PurchaseSubmissionParams {
  account: string;
  wallet: WalletDetail;
  submission: RequestSubmission;
  setStatus?: (status: string) => void;
}

export const usePurchases = () => {
  const [loading, setLoading] = useState(true);
  const [loadedPurchases, setLoadedPurchases] = useState(false);
  const [purchases, setPurchases] = useState<SubmissionPurchase[]>([]);

  const { fetchIPFSData } = useIpfs();
  const { selectedAccount } = useWallet();
  const { contractService } = useContractService();

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
    if (selectedAccount && !loadedPurchases) {
      setLoadedPurchases(true);
      fetchPurchases();
    }
  }, [selectedAccount, loadedPurchases, fetchPurchases]);

  const purchaseSubmission = useCallback(
    async ({ wallet, account, submission, setStatus }: PurchaseSubmissionParams) => {
      setStatus?.('Purchasing image...');

      try {
        await contractService.purchaseSubmission({
          wallet,
          account,
          address: submission.id,
        });
      } catch (error) {
        console.error('Error purchasing submission:', error);
        return;
      }

      setStatus?.('Minting FixMyPic NFT...');

      try {
        console.log('DEBUG: Minting NFT for submission:', submission);
        const result = await axios.post('/api/nft/mint', {
          submissionAddress: submission.id,
          tokenURI: submission.ipfsHash,
        });
        console.log('DEBUG: Minted NFT:', result.data);
      } catch (error) {
        console.error('Error minting NFT:', error);
        return;
      }
    },
    [contractService]
  );

  return { loading, purchases, purchaseSubmission };
};

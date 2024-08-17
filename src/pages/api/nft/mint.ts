import { ethers } from 'ethers';
import { getServerSession } from 'next-auth';

import { getFixMyPicContractService } from '@/services/contractService';
import { getLogger } from '@/utils/logging';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';

const logger = getLogger('nft/mint');

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';
if (!RPC_URL) {
  throw new Error('RPC_URL is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.address) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const { submissionAddress, tokenURI } = req.body;

  if (!tokenURI || !submissionAddress) {
    res.status(400).json({ message: 'Submission Address and Token URI are required' });
    return;
  }

  try {
    const userAddress = session.address;
    logger.debug('User Address:', userAddress);
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    logger.debug('Provider:', provider);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);
    logger.debug('Wallet:', wallet);

    const contractService = await getFixMyPicContractService();
    const tokenId = await contractService.mintNFTForSubmission({
      wallet,
      userAddress,
      tokenURI,
      submissionAddress,
    });
    logger.debug('Minted NFT:', tokenId);

    if (!tokenId) {
      logger.error(
        'NFT could not be minted for user, submission, tokenURI, by wallet',
        userAddress,
        submissionAddress,
        tokenURI,
        wallet.address
      );
      res.status(403).json({ message: 'NFT could not be minted!' });
      return;
    }

    res.status(200).json({ tokenId: Number(tokenId) });
  } catch (error) {
    logger.error('Error minting NFT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

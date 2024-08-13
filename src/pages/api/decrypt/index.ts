import { createDecipheriv, createHash } from 'crypto';

import { getBuiltGraphSDK } from '@/graphql/client';
import { getLogger } from '@/utils/logging';

import type { NextApiRequest, NextApiResponse } from 'next';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPT_SECRET_KEY;

const logger = getLogger('api/decrypt');

const decrypt = (encryptedText: string) => {
  const key = createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const iv = encryptedBuffer.slice(0, 16);
  const encryptedContent = encryptedBuffer.slice(16);
  const decipher = createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
  return decrypted.toString();
};

const verifyPurchase = async (userAddress: string, submissionAddress: string): Promise<boolean> => {
  try {
    const sdk = getBuiltGraphSDK();
    const { submissionPurchases: purchases } = await sdk.GetSubmissionPurchase({
      submission: submissionAddress,
      purchaser: userAddress,
    });
    return purchases.length > 0;
  } catch (error) {
    logger.error('Error verifying purchase:', error);
    return false;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { encryptedPictureId, userAddress, submissionAddress } = req.body;

  if (!encryptedPictureId || !userAddress || !submissionAddress) {
    res.status(400).json({ message: 'Encrypted Picture ID, User Address, and Submission Address are required' });
    return;
  }

  try {
    const purchased = await verifyPurchase(userAddress, submissionAddress);

    if (!purchased) {
      logger.error('User has not purchased this submission', userAddress, submissionAddress);
      res.status(403).json({ message: 'User has not purchased this submission' });
      return;
    }

    const decryptedImageId = decrypt(encryptedPictureId);
    res.status(200).json({ decryptedImageId });
  } catch (error) {
    logger.error('Error decrypting image ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

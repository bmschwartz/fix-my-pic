import { createDecipheriv, createHash } from 'crypto';
import axios, { AxiosError } from 'axios';

import type { NextApiRequest, NextApiResponse } from 'next';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPT_SECRET_KEY;

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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verifyPurchase`, {
      userAddress,
      submissionAddress,
    });
    return response.data.purchased;
  } catch (error) {
    const err = error as AxiosError;
    console.error('Error verifying purchase:', err.response ? err.response.data : err.message);
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
      res.status(403).json({ message: 'User has not purchased this submission' });
      return;
    }

    const decryptedImageId = decrypt(encryptedPictureId);
    res.status(200).json({ decryptedImageId });
  } catch (error) {
    const err = error as AxiosError;
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}

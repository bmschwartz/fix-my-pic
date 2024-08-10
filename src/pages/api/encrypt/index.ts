import { createCipheriv, createHash, randomBytes } from 'crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPT_SECRET_KEY;

const encrypt = (text: string) => {
  const iv = randomBytes(16);
  const key = createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([iv, cipher.update(text), cipher.final()]);
  return encrypted.toString('hex');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { pictureId } = req.body;

  if (!pictureId) {
    res.status(400).json({ message: 'Picture ID is required' });
    return;
  }

  try {
    const encryptedPictureId = encrypt(pictureId);
    res.status(200).json({ encryptedPictureId });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { createDecipheriv, createHash } from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = process.env.SECRET_KEY || 'mysecretkey' // Replace with your secret key

const decrypt = (encryptedText: string) => {
  const key = createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32)
  const encryptedBuffer = Buffer.from(encryptedText, 'hex')
  const iv = encryptedBuffer.slice(0, 16)
  const encryptedContent = encryptedBuffer.slice(16)
  const decipher = createDecipheriv(algorithm, key, iv)
  const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()])
  return decrypted.toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  const { encryptedPictureId } = req.body

  if (!encryptedPictureId) {
    res.status(400).json({ message: 'Encrypted Picture ID is required' })
    return
  }

  try {
    const decryptedPictureId = decrypt(encryptedPictureId)
    res.status(200).json({ decryptedPictureId })
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}

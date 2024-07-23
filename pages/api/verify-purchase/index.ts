import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  const { userAddress, submissionId } = req.body

  if (!userAddress || !submissionId) {
    res.status(400).json({ message: 'User Address and Submission ID are required' })
    return
  }

  console.log(`User Address: ${userAddress}`)
  console.log(`Submission ID: ${submissionId}`)

  res.status(200).json({ purchased: true })
}

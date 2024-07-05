import { NextApiRequest, NextApiResponse } from 'next'

import { Bounty } from '@/types/bounty'
import { getPictureBountyApi } from '@/contracts/api/pictureBounty'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { getPictureBounty } = await getPictureBountyApi()

  switch (req.method) {
    case 'GET':
      const { address } = req.query

      if (!address || Array.isArray(address)) {
        res.status(400).end('Missing address')
        return
      }

      try {
        const bounty: Bounty = await getPictureBounty({ address })
        res.status(200).json({ bounty })
      } catch (e) {
        console.error(`Error fetching bounty at ${address}:`, e)
        res.status(500).json({ error: `Error fetching bounty ${address}` })
      }
      break

    default:
      // Handle other HTTP methods
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

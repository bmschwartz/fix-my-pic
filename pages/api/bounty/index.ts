import { NextApiRequest, NextApiResponse } from 'next'
import { getPictureBountyApi } from '@/contracts/api/pictureBounty'
import { Bounty, BountyStatus } from '@/types/bounty'

interface GetPictureBountyArgs {
  filters?: {
    status: BountyStatus
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { getPictureBounties } = await getPictureBountyApi()

  switch (req.method) {
    case 'GET':
      const { filters }: GetPictureBountyArgs = req.query

      try {
        const bounties: Bounty[] = await getPictureBounties({ filters })
        res.status(200).json({ bounties })
      } catch (e) {
        console.error('Error fetching bounties:', e)
        res.status(500).json({ error: 'Error fetching bounties' })
      }
      break

    default:
      // Handle other HTTP methods
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

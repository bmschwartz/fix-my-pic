import { getEthPrice } from '@/services/priceService';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ethPrice: getEthPrice().toString(),
  });
}

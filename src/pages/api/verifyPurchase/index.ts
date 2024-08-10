import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { userAddress, submissionAddress } = req.body;

  if (!userAddress || !submissionAddress) {
    res.status(400).json({ message: 'User Address and Submission Address are required' });
    return;
  }

  // const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';
  // const provider = new Provider(RPC_URL);

  // const submissionContract = new Contract(submissionAddress, RequestSubmissionSchema.abi, provider);
  // const purchasers = Object.values(await submissionContract.getPurchaserList()).map((address: unknown) => {
  //   return (address as string).toUpperCase();
  // });

  // const purchased = purchasers.includes(userAddress.toUpperCase());
  // const sdk = getBuiltGraphSDK();
  // sdk.
  const purchased = true;

  res.status(200).json({ purchased });
}

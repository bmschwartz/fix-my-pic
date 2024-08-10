import type { NextApiRequest, NextApiResponse } from 'next';

const keyRestrictions = {
  keyName: 'Signed Upload JWT',
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false,
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: true,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false,
      },
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify(keyRestrictions),
      };

      const jwtRepsonse = await fetch('https://api.pinata.cloud/users/generateApiKey', options);
      const json = await jwtRepsonse.json();
      const { JWT } = json;
      res.send(JWT);
    } catch (e) {
      res.status(500).send('Server Error');
    }
  }
}

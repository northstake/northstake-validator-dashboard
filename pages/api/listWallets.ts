import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApi, listWallets as list } from '../../app/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    try {
      const api =  initializeApi()
      const wallets = await list(api);
      res.status(200).json({ success: true, wallets });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
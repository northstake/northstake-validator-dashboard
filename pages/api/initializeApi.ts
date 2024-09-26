import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const apiKey = process.env.API_KEY;
      const privateKey = process.env.PRIVATE_KEY;

      if (!apiKey || !privateKey) {
        throw new Error('API_KEY and PRIVATE_KEY must be defined');
      }

      const api =  initializeApi();

      res.status(200).json({ success: true, api });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

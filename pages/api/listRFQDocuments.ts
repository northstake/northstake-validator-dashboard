import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApi, listRFQDocuments as listDocuments } from '../../app/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const api =  initializeApi()
      const documents = await listDocuments(api);
      res.status(200).json({ success: true, documents });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

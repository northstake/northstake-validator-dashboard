import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi, createRFQ } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { apiKey, privateKey, server, newRFQ } = req.body
    try {
      const api = initializeApi(apiKey, privateKey, server)
      const result = await createRFQ(api, newRFQ)
      res.status(200).json({ success: true, result })
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

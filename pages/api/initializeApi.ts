import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { apiKey, privateKey } = req.body
    try {
      const api = initializeApi(apiKey, privateKey)
      res.status(200).json({ success: true, api })
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import { acceptQuote, initializeApi } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { apiKey, privateKey, server, rfqId, quoteId } = req.body

    if (!apiKey || !privateKey || !server || !rfqId || !quoteId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    try {
      const api = initializeApi(apiKey, privateKey, server)
      await acceptQuote(api, rfqId, quoteId)
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to accept quote:', error)
      return res.status(500).json({ success: false, error: 'Failed to accept quote' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

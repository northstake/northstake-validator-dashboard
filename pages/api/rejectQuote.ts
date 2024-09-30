import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi, rejectQuote } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { rfqId, quoteId } = req.body

    if (!rfqId || !quoteId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    try {
      const api = initializeApi()
      await rejectQuote(api, rfqId, quoteId)
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Failed to reject quote:', error)
      return res.status(500).json({ success: false, error: 'Failed to reject quote' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

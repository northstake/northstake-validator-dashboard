import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi, removeWallet } from '../../app/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {walletId } = req.body
    try {
      const api =  initializeApi()
      console.log('removeing wallet', walletId)
      const result = await removeWallet(api, walletId)
      res.status(200).json({ success: true, result })
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}
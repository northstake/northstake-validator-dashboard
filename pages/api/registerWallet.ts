import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi, registerWallet } from '../../app/api'
import { AddLinkedWalletRequest } from '@northstake/northstakeapi'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { walletName, walletAddress } = req.body
    try {
      const api =  initializeApi()
      const request: AddLinkedWalletRequest = {
        walletName,
        walletAddress,
        asset: 'ETH'
      }
      const result = await registerWallet(api, request)
      res.status(200).json({ success: true, result })
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

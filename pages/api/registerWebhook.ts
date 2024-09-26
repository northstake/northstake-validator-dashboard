import { NextApiRequest, NextApiResponse } from 'next'
import { initializeApi, registerWebhook } from '../../app/api'
import { WebhookRegistration } from '@northstake/northstakeapi'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { authToken, url, webhookType } = req.body
    try {
      const api =  initializeApi()
      const request: WebhookRegistration = {
        secret: authToken,
        url,
        eventType: webhookType
      }
      const result = await registerWebhook(api, request)
      res.status(200).json({ success: true, result })
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}

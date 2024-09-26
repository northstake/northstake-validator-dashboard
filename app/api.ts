import {
  AddLinkedWalletRequest,
  NorthstakeApi,
  Wallet,
  ValidatorInfo,
  RFQDocumentSeller,
  WebHookLookupAnswer,
  WebhookRegistration,
  CreateRFQRequest,
  AccountEntity
} from '@northstake/northstakeapi'

export const initializeApi = (
  apiKey = process.env.API_KEY,
  privateKey = process.env.PRIVATE_KEY,
  server = process.env.NEXT_PUBLIC_SERVER || 'test'
) => {
  const apiUrl = {
    localhost: 'http://localhost:8080/v1',
    test: 'https://test.api.northstake.dk/v1',
    production: 'https://api.northstake.dk/v1'
  }[server as 'localhost' | 'test' | 'production']

  if (!apiKey || !privateKey || !apiUrl) {
    throw new Error('API_KEY, PRIVATE_KEY, and SERVER must be provided during login or set in .env')
  }
  //remove \n newlines and replace with actual newlines
  const cleanedApiKey = apiKey.replace(/\\n/g, '\n')
  const cleanedPrivateKey = privateKey.replace(/\\n/g, '\n')
  const api = new NorthstakeApi(cleanedApiKey, cleanedPrivateKey, apiUrl)
  return api
}

export const getUser = async (api: NorthstakeApi): Promise<AccountEntity> => {
  const response = await api.account.getAccountInformation()
  return response.body
}

export const listRFQDocuments = async (api: NorthstakeApi): Promise<RFQDocumentSeller[]> => {
  const response = await api.validatorMarketplaceSellers.listRFQs()
  return response.body
}

export async function registerWallet(
  api: NorthstakeApi,
  request: AddLinkedWalletRequest
): Promise<{
  body: unknown
  status: number
}> {
  const result = await api.linkedWallets.addLinkedWallet(request)
  return result
}

export async function listWallets(api: NorthstakeApi): Promise<Wallet[]> {
  const wallets = await api.linkedWallets.listLinkedWallets()
  return wallets.body
}

export async function removeWallet(
  api: NorthstakeApi,
  walletId: string
): Promise<{
  body: unknown
  status: number
}> {
  const response = await api.linkedWallets.deleteLinkedWallet(walletId)
  return response
}

export async function listValidators(api: NorthstakeApi): Promise<ValidatorInfo[]> {
  const validators = await api.validators.getValidators()
  return validators.body
}

export async function createRFQ(api: NorthstakeApi, newRFQ: CreateRFQRequest): Promise<RFQDocumentSeller> {
  const createdRFQ = await api.validatorMarketplaceSellers.createRFQ(newRFQ)
  return createdRFQ.body
}

export async function listActiveRFQs(api: NorthstakeApi): Promise<RFQDocumentSeller[]> {
  const rfqs = await api.validatorMarketplaceSellers.listRFQs('active')
  return rfqs.body
}

export async function acceptQuote(api: NorthstakeApi, rfqId: string, quoteId: string): Promise<unknown> {
  const response = await api.validatorMarketplaceSellers.acceptQuote(rfqId, quoteId)
  return response
}

export async function rejectQuote(api: NorthstakeApi, selectedRFQ: string, quoteId: string): Promise<unknown> {
  const response = await api.validatorMarketplaceSellers.rejectQuote(selectedRFQ, quoteId)
  return response
}

export async function registerWebhook(api: NorthstakeApi, newWebhook: WebhookRegistration): Promise<unknown> {
  const result = await api.validatorMarketplaceWebhooks.registerWebhook(newWebhook)
  return result
}

export async function listWebhooks(api: NorthstakeApi): Promise<WebHookLookupAnswer[]> {
  const webhooks = await api.validatorMarketplaceWebhooks.listRegisteredWebhooks()
  return webhooks.body
}

export async function removeWebhook(api: NorthstakeApi, selectedWebhook: string): Promise<unknown> {
  const response = await api.validatorMarketplaceWebhooks.deleteWebhook(selectedWebhook)
  return response
}

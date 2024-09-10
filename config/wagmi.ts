import { http, createConfig } from 'wagmi'
import { holesky } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [ holesky],
  connectors: [walletConnect({
    projectId: '368e7ff42529475f80de64bd0e726eb1',
  })],
  transports: {
 
    [holesky.id]: http(),
  },
})
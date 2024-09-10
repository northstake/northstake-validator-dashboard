import { http, createConfig } from 'wagmi'
import { holesky, mainnet } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, holesky],
  connectors: [walletConnect({
    projectId: '368e7ff42529475f80de64bd0e726eb1',
  })],
  transports: {
    [mainnet.id]: http(),
    [holesky.id]: http(),
  },
})
'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'


import { createConfig, http } from 'wagmi'

const scrollSepolia = {
  id: 534351,
  name: 'Scroll Sepolia',
  network: 'scroll-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Scrollscan', url: 'https://sepolia.scrollscan.com' },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: 'Sharaka DApp',
  projectId: 'ee2ef06ca71a4710f4ab71a06079d010', // يمكنك الحصول عليه من walletconnect.com
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http('https://sepolia-rpc.scroll.io')
  },
})

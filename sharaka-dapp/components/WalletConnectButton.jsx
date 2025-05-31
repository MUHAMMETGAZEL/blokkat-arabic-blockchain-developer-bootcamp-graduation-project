/*'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WalletConnectButton() {
  return <ConnectButton />
}
*/

'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WalletConnectButton() {
  return (
    <ConnectButton 
      label="ربط المحفظة"
      showBalance={{
        smallScreen: false,
        largeScreen: true
      }}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full'
      }}
      chainStatus="icon"
      className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-full transition shadow-md"
    />
  )
}
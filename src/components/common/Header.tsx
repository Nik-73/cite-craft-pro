import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut } from 'lucide-react'

export default function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">DAO 3.0 Platform</h1>
            <p className="text-xs text-gray-500">Decentralized Governance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{truncateAddress(address)}</p>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
              <button
                onClick={() => disconnect()}
                className="btn btn-secondary flex items-center gap-2"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="btn btn-primary flex items-center gap-2"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

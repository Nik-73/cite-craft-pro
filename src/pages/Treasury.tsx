import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react'

export default function Treasury() {
  const transactions = [
    {
      id: '1',
      type: 'incoming' as const,
      amount: '50 ETH',
      from: '0x1234...5678',
      description: 'Grant funding received',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'outgoing' as const,
      amount: '10 ETH',
      to: '0xabcd...efgh',
      description: 'Marketing campaign payment',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      type: 'incoming' as const,
      amount: '25 ETH',
      from: '0x9876...5432',
      description: 'Token sale proceeds',
      timestamp: '3 days ago',
    },
  ]

  const assets = [
    { symbol: 'ETH', balance: '245.5', value: '$489,000', change: '+5.2%' },
    { symbol: 'USDC', balance: '150,000', value: '$150,000', change: '0%' },
    { symbol: 'DAI', balance: '75,000', value: '$74,925', change: '-0.1%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Treasury</h1>
        <p className="text-gray-600 mt-1">Manage DAO assets and track transactions</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-700">Total Treasury Value</h2>
          <TrendingUp className="text-green-500" size={24} />
        </div>
        <p className="text-4xl font-bold text-gray-900">$2,413,925</p>
        <p className="text-green-600 mt-2">+8.2% this month</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset.symbol} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{asset.symbol}</h3>
              <span className={`text-sm ${
                asset.change.startsWith('+') ? 'text-green-600' :
                asset.change.startsWith('-') ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {asset.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{asset.balance}</p>
            <p className="text-gray-600 mt-1">{asset.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {tx.type === 'incoming' ? (
                    <ArrowDownLeft className="text-green-600" size={20} />
                  ) : (
                    <ArrowUpRight className="text-red-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-600">
                    {tx.type === 'incoming' ? `From ${tx.from}` : `To ${tx.to}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  tx.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'incoming' ? '+' : '-'}{tx.amount}
                </p>
                <p className="text-sm text-gray-500">{tx.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

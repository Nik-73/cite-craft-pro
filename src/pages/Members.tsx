import { Search, Users as UsersIcon, TrendingUp } from 'lucide-react'

export default function Members() {
  const members = [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      votingPower: '15,234',
      proposalsCreated: 5,
      votesCount: 23,
      joinedAt: '3 months ago',
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      votingPower: '12,456',
      proposalsCreated: 3,
      votesCount: 18,
      joinedAt: '5 months ago',
    },
    {
      address: '0x9876543210fedcba9876543210fedcba98765432',
      votingPower: '8,932',
      proposalsCreated: 2,
      votesCount: 15,
      joinedAt: '7 months ago',
    },
  ]

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600 mt-1">View and manage DAO members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="text-primary-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-green-600 mt-1">+12.5% this month</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">847</p>
          <p className="text-gray-600 mt-1">68% participation</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="text-orange-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-700">Voting Power</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">2.4M</p>
          <p className="text-gray-600 mt-1">Total tokens</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search members by address..."
              className="input pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Voting Power</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Proposals</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Votes Cast</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.address} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {truncateAddress(member.address)}
                    </code>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{member.votingPower}</td>
                  <td className="py-4 px-4 text-gray-700">{member.proposalsCreated}</td>
                  <td className="py-4 px-4 text-gray-700">{member.votesCount}</td>
                  <td className="py-4 px-4 text-gray-600">{member.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Governance() {
  const [filter, setFilter] = useState<'all' | 'active' | 'succeeded' | 'defeated'>('all')

  const proposals = [
    {
      id: '1',
      title: 'Allocate 100 ETH for Marketing Campaign',
      description: 'Fund a comprehensive marketing campaign to increase DAO visibility',
      status: 'active' as const,
      votesFor: 65,
      votesAgainst: 35,
      endsIn: '2 days',
    },
    {
      id: '2',
      title: 'Hire Community Manager',
      description: 'Proposal to hire a full-time community manager',
      status: 'active' as const,
      votesFor: 72,
      votesAgainst: 28,
      endsIn: '4 days',
    },
    {
      id: '3',
      title: 'Update Governance Parameters',
      description: 'Adjust quorum requirements and voting period',
      status: 'succeeded' as const,
      votesFor: 88,
      votesAgainst: 12,
      endsIn: 'Ended',
    },
  ]

  const filteredProposals = filter === 'all'
    ? proposals
    : proposals.filter(p => p.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Governance</h1>
          <p className="text-gray-600 mt-1">Vote on proposals and shape the DAO's future</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Proposal
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search proposals..."
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="input w-auto"
            >
              <option value="all">All Proposals</option>
              <option value="active">Active</option>
              <option value="succeeded">Succeeded</option>
              <option value="defeated">Defeated</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Link
              key={proposal.id}
              to={`/proposal/${proposal.id}`}
              className="block p-6 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                  <p className="text-gray-600 mt-1">{proposal.description}</p>
                </div>
                <span className={`badge ml-4 ${
                  proposal.status === 'active' ? 'badge-info' :
                  proposal.status === 'succeeded' ? 'badge-success' :
                  'badge-error'
                }`}>
                  {proposal.status}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">For: {proposal.votesFor}%</span>
                    <span className="text-gray-600">Against: {proposal.votesAgainst}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${proposal.votesFor}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ends in</p>
                  <p className="text-sm font-medium text-gray-900">{proposal.endsIn}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

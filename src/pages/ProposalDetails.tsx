import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'

export default function ProposalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/governance')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Back to Governance
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proposal #{id}</h1>
            <p className="text-gray-600 mt-2">Allocate 100 ETH for Marketing Campaign</p>
          </div>
          <span className="badge badge-info">Active</span>
        </div>

        <div className="prose max-w-none mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700">
            This proposal seeks to allocate 100 ETH from the treasury for a comprehensive marketing campaign
            aimed at increasing DAO visibility and attracting new members. The campaign will include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
            <li>Social media advertising on Twitter, LinkedIn, and Discord</li>
            <li>Content creation including articles and video tutorials</li>
            <li>Partnership outreach to other DAOs and protocols</li>
            <li>Community events and AMAs</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-900">For</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">65%</p>
            <p className="text-sm text-gray-600 mt-1">1,625,000 votes</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="text-red-600" size={20} />
              <h3 className="font-semibold text-gray-900">Against</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">35%</p>
            <p className="text-sm text-gray-600 mt-1">875,000 votes</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Minus className="text-gray-600" size={20} />
              <h3 className="font-semibold text-gray-900">Abstain</h3>
            </div>
            <p className="text-2xl font-bold text-gray-600">0%</p>
            <p className="text-sm text-gray-600 mt-1">0 votes</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            <ThumbsUp size={20} />
            Vote For
          </button>
          <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
            <ThumbsDown size={20} />
            Vote Against
          </button>
          <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
            <Minus size={20} />
            Abstain
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Proposed by</p>
              <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded">0x1234...5678</code>
            </div>
            <div>
              <p className="text-gray-600">Started</p>
              <p className="text-gray-900 font-medium">2 days ago</p>
            </div>
            <div>
              <p className="text-gray-600">Ends in</p>
              <p className="text-gray-900 font-medium">2 days</p>
            </div>
            <div>
              <p className="text-gray-600">Total Votes</p>
              <p className="text-gray-900 font-medium">2,500,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

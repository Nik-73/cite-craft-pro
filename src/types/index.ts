export interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  status: 'active' | 'succeeded' | 'defeated' | 'executed' | 'pending'
  votesFor: bigint
  votesAgainst: bigint
  votesAbstain: bigint
  startBlock: bigint
  endBlock: bigint
  eta: bigint | null
  createdAt: Date
  executedAt: Date | null
}

export interface Vote {
  proposalId: string
  voter: string
  support: 0 | 1 | 2 // against, for, abstain
  weight: bigint
  reason?: string
  timestamp: Date
}

export interface Member {
  address: string
  tokenBalance: bigint
  votingPower: bigint
  delegatedTo?: string
  delegatedFrom?: string[]
  proposalsCreated: number
  votesCount: number
  joinedAt: Date
}

export interface TreasuryTransaction {
  id: string
  type: 'incoming' | 'outgoing'
  amount: bigint
  token: string
  from: string
  to: string
  description?: string
  proposalId?: string
  timestamp: Date
  txHash: string
}

export interface DAOStats {
  totalMembers: number
  totalProposals: number
  activeProposals: number
  treasuryValue: bigint
  votingPower: bigint
  participationRate: number
}

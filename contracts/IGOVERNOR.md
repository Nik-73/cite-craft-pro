# Governor Contract Interface

This template is designed to work with OpenZeppelin Governor contracts.

## Required Contract Functions

Your Governor contract should implement these key functions:

### Proposal Functions

```solidity
function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
) public returns (uint256 proposalId)

function castVote(uint256 proposalId, uint8 support) public returns (uint256)

function execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public payable returns (uint256)
```

### Query Functions

```solidity
function state(uint256 proposalId) public view returns (ProposalState)

function proposalVotes(uint256 proposalId) public view returns (
    uint256 againstVotes,
    uint256 forVotes,
    uint256 abstainVotes
)

function getVotes(address account, uint256 blockNumber) public view returns (uint256)
```

## Integration Steps

1. Deploy your Governor, Token, and Timelock contracts
2. Add contract addresses to `.env`
3. Export contract ABIs to `src/contracts/abis/`
4. Update `src/config/contracts.ts` with contract configurations
5. Create hooks in `src/hooks/contracts/` for contract interactions

## Example Contracts

See `contracts/examples/` for reference implementations using OpenZeppelin.

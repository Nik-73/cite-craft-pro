# DAO 3.0 Platform Template

A modern, decentralized autonomous organization (DAO) platform template built with React, TypeScript, and Web3 technologies.

## Features

- 🗳️ **Governance System**: Create and vote on proposals with on-chain execution
- 💰 **Treasury Management**: Transparent fund allocation and spending tracking
- 👥 **Member Management**: Token-based membership with role assignments
- 📊 **Analytics Dashboard**: Real-time DAO metrics and activity tracking
- 🔐 **Web3 Integration**: Seamless wallet connectivity with WalletConnect
- 🎨 **Modern UI**: Beautiful, responsive interface built with TailwindCSS
- ⚡ **Fast Performance**: Powered by Vite for lightning-fast development
- 🔒 **Type-Safe**: Full TypeScript support for robust development

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_DAO_CONTRACT_ADDRESS=your_dao_contract_address
VITE_TOKEN_CONTRACT_ADDRESS=your_token_contract_address
VITE_TREASURY_CONTRACT_ADDRESS=your_treasury_contract_address
VITE_CHAIN_ID=1
```

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS + Lucide Icons
- **Web3**: Wagmi + Viem + Ethers.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Build Tool**: Vite
- **Testing**: Vitest

### Project Structure

```
dao3-platform-template/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── governance/  # Governance-related components
│   │   ├── treasury/    # Treasury management components
│   │   ├── members/     # Member management components
│   │   └── common/      # Common UI elements
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── contracts/      # Contract ABIs and configurations
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles
├── contracts/          # Smart contract source files
├── scripts/           # Deployment and utility scripts
└── public/            # Static assets
```

## Core Features

### Governance

- **Proposal Creation**: Submit proposals with detailed descriptions
- **Voting Mechanism**: Token-weighted voting system
- **Execution**: Automatic on-chain execution of passed proposals
- **Delegation**: Delegate voting power to trusted members

### Treasury

- **Fund Management**: Track and manage DAO treasury
- **Spending Proposals**: Request and approve fund allocations
- **Transaction History**: Complete audit trail of all transactions
- **Multi-sig Support**: Optional multi-signature requirements

### Membership

- **Token Gating**: Access based on token holdings
- **Role System**: Customizable member roles and permissions
- **Member Directory**: Browse and search DAO members
- **Contribution Tracking**: Track member contributions and activity

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Check TypeScript types

### Adding Smart Contracts

1. Place your contract ABI JSON files in `src/contracts/abis/`
2. Update contract addresses in `.env`
3. Create type-safe contract hooks in `src/hooks/contracts/`

### Customization

The template is designed to be easily customizable:

- **Theming**: Modify `tailwind.config.ts` for custom colors and styles
- **Contract Integration**: Update contract ABIs and addresses
- **Features**: Add or remove features based on your DAO's needs

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy Options

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **IPFS**: Upload `dist/` folder to IPFS for decentralized hosting
- **Traditional hosting**: Serve the `dist/` folder with any static host

## Smart Contract Integration

This template is designed to work with standard DAO smart contracts including:

- Governor contracts (OpenZeppelin Governor)
- ERC20 governance tokens
- Treasury/Timelock contracts
- NFT-based membership systems

See `contracts/` directory for example contract interfaces.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security

- Always audit smart contracts before deployment
- Use multi-sig for treasury management
- Implement timelock for critical operations
- Follow security best practices for Web3 development

## License

MIT License - feel free to use this template for your DAO project.

## Support

For questions and support:
- Open an issue on GitHub
- Join our community Discord
- Check the documentation

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Gasless voting (meta-transactions)
- [ ] Snapshot integration
- [ ] Discord/Telegram bot integration

---

Built with ❤️ for the DAO community

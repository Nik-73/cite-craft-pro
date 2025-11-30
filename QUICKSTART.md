# Quick Start Guide

Get your DAO 3.0 Platform up and running in 5 minutes!

## Prerequisites

- Node.js 18+ or Bun installed
- A code editor (VS Code recommended)
- A Web3 wallet (MetaMask, etc.)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Configure environment**
   ```bash
   # The .env file is already created with demo values
   # Update it with your actual values:
   nano .env
   ```

   Get a WalletConnect Project ID from https://cloud.walletconnect.com

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   - Navigate to http://localhost:3000
   - Connect your wallet
   - Start exploring!

## What's Included

- ✅ **Dashboard** - Overview of your DAO
- ✅ **Governance** - Create and vote on proposals
- ✅ **Treasury** - Manage DAO funds
- ✅ **Members** - View DAO members and voting power

## Next Steps

1. **Deploy Smart Contracts**
   - Deploy your Governor, Token, and Treasury contracts
   - Update contract addresses in `.env`
   - Add contract ABIs to `src/contracts/abis/`

2. **Customize the UI**
   - Edit colors in `tailwind.config.ts`
   - Modify components in `src/components/`
   - Update pages in `src/pages/`

3. **Deploy to Production**
   - See `DEPLOYMENT_GUIDE.md` for detailed instructions
   - Deploy to Vercel, Netlify, or IPFS

## Common Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
npm test           # Run tests
```

## Need Help?

- Check the main `README.md` for detailed documentation
- Review `DEPLOYMENT_GUIDE.md` for deployment help
- See `CONTRIBUTING.md` for development guidelines
- Open an issue if you find a bug

## Important Notes

⚠️ **Before deploying to production:**
- Replace demo contract addresses with real ones
- Get a real WalletConnect Project ID
- Audit your smart contracts
- Test thoroughly on testnet

Happy building! 🚀

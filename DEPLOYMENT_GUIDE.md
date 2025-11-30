# Deployment Guide

This guide walks you through deploying your DAO 3.0 Platform.

## Prerequisites

- Smart contracts deployed on your target blockchain
- WalletConnect Project ID from https://cloud.walletconnect.com
- Node.js 18+ or Bun installed

## Step 1: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_DAO_CONTRACT_ADDRESS=0xYourGovernorContractAddress
VITE_TOKEN_CONTRACT_ADDRESS=0xYourTokenContractAddress
VITE_TREASURY_CONTRACT_ADDRESS=0xYourTimelockContractAddress
VITE_CHAIN_ID=1
```

## Step 2: Install Dependencies

```bash
npm install
# or
bun install
```

## Step 3: Build the Application

```bash
npm run build
# or
bun run build
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

Or connect your GitHub repository to Vercel:
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy

### Option 2: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. For production: `netlify deploy --prod`

Or use Netlify dashboard:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### Option 3: IPFS (Decentralized)

For truly decentralized hosting:

```bash
# Install IPFS CLI
npm install -g ipfs

# Build the app
npm run build

# Add to IPFS
ipfs add -r dist

# Pin the CID
ipfs pin add <your-CID>
```

Access via: `https://ipfs.io/ipfs/<your-CID>`

Or use services like:
- Fleek: https://fleek.co
- Pinata: https://pinata.cloud
- Web3.Storage: https://web3.storage

### Option 4: Traditional Hosting

Deploy the `dist/` folder to any static hosting service:

- AWS S3 + CloudFront
- Google Cloud Storage
- DigitalOcean Spaces
- GitHub Pages

## Post-Deployment

1. Test wallet connectivity
2. Verify contract interactions
3. Test proposal creation and voting
4. Check treasury displays correctly
5. Ensure all pages load properly

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

### IPFS
Use ENS (Ethereum Name Service) or DNSLink:
1. Get an ENS domain
2. Set content hash to your IPFS CID
3. Access via `yourname.eth.link`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect Cloud Project ID | Yes |
| `VITE_DAO_CONTRACT_ADDRESS` | Governor contract address | Yes |
| `VITE_TOKEN_CONTRACT_ADDRESS` | Governance token address | Yes |
| `VITE_TREASURY_CONTRACT_ADDRESS` | Treasury/Timelock address | Yes |
| `VITE_CHAIN_ID` | Network chain ID (1 for mainnet) | Yes |
| `VITE_RPC_URL` | Custom RPC endpoint (optional) | No |

## Monitoring

Consider adding:
- Analytics (Google Analytics, Plausible)
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)

## Security Checklist

- [ ] All environment variables configured
- [ ] Smart contracts audited
- [ ] HTTPS enabled
- [ ] Content Security Policy configured
- [ ] Rate limiting for API calls
- [ ] Input validation on all forms

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

### Wallet Won't Connect
- Verify WalletConnect Project ID
- Check network configuration
- Ensure user is on correct chain

### Contract Calls Fail
- Verify contract addresses
- Check ABI matches deployed contracts
- Ensure user has sufficient gas

## Support

For deployment issues:
- Check the logs in your hosting platform
- Review environment variables
- Ensure contracts are deployed correctly
- Test locally first with `npm run preview`

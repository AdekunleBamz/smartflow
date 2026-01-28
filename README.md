# SmartFlow - Smart Money Tracking for Base Chain

A sophisticated Farcaster mini app for real-time smart money intelligence on Base chain. Track top traders, monitor wallet flows, and identify profitable opportunities before the crowd catches up.

## Features

✨ **Smart Money Leaderboard** - Track the top 5,000 performing traders ranked by profit and win rate
⚡ **Real-Time Flows** - Monitor wallet movements and identify smart money entries/exits instantly  
🎯 **Opportunity Alerts** - Get notified when smart wallets make significant moves on Base
🔐 **Farcaster Integration** - Seamless authentication with Farcaster accounts
💎 **Modern UI** - Beautiful glassmorphism design with smooth animations

## Tech Stack
## Recent Updatesnn- Upgraded Next.js to 14.1.0 for improved performancen- Updated framer-motion to 11.0.0 with latest animationsn- Enhanced UI with hover effects and glow animationsn- Added tooltips for better user experience
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 with custom glassmorphism theme
- **Animations**: Framer Motion 10.16
- **State**: Zustand 4.4 for lightweight global state
- **Data Fetching**: React Query with 60-second cache TTL
- **Visualization**: Recharts 2.10 for charts
- **Wallet**: Wagmi 2.10 + Viem 2.13
- **Farcaster**: @farcaster/miniapp-sdk 0.0.61
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic API key injection

## Project Structure

```
smartflow/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles
│   ├── dashboard/page.tsx    # Dashboard with top traders
│   ├── leaderboard/page.tsx  # Full leaderboard (top 100)
│   └── alerts/page.tsx       # Opportunity alerts
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── StatCard.tsx          # Reusable stat card
│   ├── WalletConnect.tsx     # Wallet connection UI
│   └── FarcasterSDKInit.tsx  # SDK initialization
├── hooks/
│   └── useSmartMoney.ts      # Custom React Query hooks
├── lib/
│   ├── nansen-api.ts         # Nansen API integration
│   ├── store.ts              # Zustand store
│   └── utils.ts              # Utility functions
├── public/
│   ├── .well-known/
│   │   └── farcaster.json    # Farcaster manifest
│   ├── logo.svg              # App logo
│   └── favicon.svg           # Favicon
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Nansen API key (from [Nansen Dashboard](https://app.nansen.ai))

### Installation

1. **Install dependencies**

```bash
cd /Users/apple/smartflow
npm install
```

2. **Configure environment variables**

Create or update `.env.local`:

```env
NEXT_PUBLIC_NANSEN_API_KEY=your_api_key_here
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_APP_DOMAIN=smartflow.com
```

3. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Building

```bash
npm run build
npm start
```

## Farcaster Deployment

### 1. Update Manifest Signature

The app requires proper Farcaster account association. Update `/public/.well-known/farcaster.json` with your account signature:

```bash
# Use Farcaster CLI to generate signature
nansen-farcaster-cli generateSignature --domain smartflow.com
```

### 2. Deploy to Vercel

```bash
vercel deploy
```

### 3. Configure Farcaster

1. Visit [Farcaster Developer Dashboard](https://developer.farcaster.cast)
2. Register your app with the deployed domain
3. Get your app icon URL and configure webhooks

## API Integration

### Nansen API Endpoints

The app uses the following Nansen API functions:

- `getSmartMoneyLeaderboard()` - Top traders with metrics
- `getSmartMoneyNetflows()` - Real-time wallet flows
- `getSmartMoneyDexTrades()` - DEX trade data with profit/loss

All requests include automatic caching with 60-second TTL to reduce API calls.

## Design System

### Colors

- **Background**: Dark theme (#0f0f1e, #1a1a2e)
- **Accent Primary**: Cyan (#00d4ff)
- **Accent Secondary**: Purple (#7c3aed)
- **Text**: Gray shades with cyan/purple highlights

### Components

- **Glassmorphism**: Frosted glass effect with 10% opacity backdrop
- **Gradients**: Cyan-to-purple for text and borders
- **Animations**: Framer Motion micro-interactions (scale, fade)
- **Icons**: Lucide React icons throughout

## Key Features

### 1. Smart Money Leaderboard
Displays top traders with:
- Real-time profit rankings
- Win rate percentages
- 30-day trade counts
- Medal icons for top 3 (gold/silver/bronze)

### 2. Real-Time Dashboard
Shows aggregate smart money intelligence:
- Total smart money value on Base
- Average win rate across top traders
- 24-hour netflow count

### 3. Opportunity Alerts
Filters and displays recent profitable trades:
- Trade profitability (filtered > 5%)
- DEX identification
- Timestamp and transaction hash
- Green highlighting for opportunities

### 4. Wallet Integration
Users can:
- Connect wallets via Farcaster
- View their connected address
- Copy address to clipboard
- See wallet connection status

## Development

### Hot Reload
The development server supports fast refresh for instant feedback on changes.

### Type Safety
Strict TypeScript throughout ensures type safety and better IDE support.

### Path Aliases
Use `@/` to import from project root:
```tsx
import { useSmartMoney } from '@/hooks/useSmartMoney';
import { StatCard } from '@/components/StatCard';
```

## Deployment Checklist

- [ ] Update `.env.local` with real Nansen API key
- [ ] Generate Farcaster account association signature
- [ ] Update manifest webhookUrl to production domain
- [ ] Deploy to Vercel or hosting provider
- [ ] Configure Farcaster app in developer dashboard
- [ ] Set up logo and splash images
- [ ] Test in Farcaster frame (use Warpcast)

## Performance

- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Next.js Image component for SVGs
- **Query Caching**: React Query caching strategy with configurable TTL
- **Bundle Size**: Tree-shaking with production builds

## Troubleshooting

### "NEXT_PUBLIC_NANSEN_API_KEY is not defined"
Ensure `.env.local` exists in project root with correct API key.

### "Farcaster SDK not available"
SDK only works within Farcaster frames. In browser, app falls back to normal mode.

### Build Errors
Clear cache and reinstall dependencies:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## License

MIT - See [LICENSE](./LICENSE) for details.

## Security

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Support

For issues with Nansen API, visit [Nansen Docs](https://docs.nansen.ai)
For Farcaster integration help, see [Farcaster Mini Apps Guide](https://docs.farcaster.xyz/reference/miniapps/farcaster-js)

---

Built with ❤️ for the Farcaster community on Base chain.

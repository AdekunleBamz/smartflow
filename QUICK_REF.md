# SmartFlow - Quick Reference Card

## 🚀 Quick Start (30 seconds)

```bash
cd /Users/apple/smartflow
npm install
cp .env.local.example .env.local  # Add your API key
npm run dev
# Visit http://localhost:3000
```

## 📂 Important Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page with hero |
| `app/dashboard/page.tsx` | Main dashboard |
| `app/leaderboard/page.tsx` | Full trader rankings |
| `app/alerts/page.tsx` | Opportunity alerts |
| `lib/nansen-api.ts` | API integration |
| `components/Header.tsx` | Navigation bar |
| `hooks/useSmartMoney.ts` | Data fetching |
| `.env.local` | Config & API key |

## 🔧 Common Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build
npm start                # Run production build
npm run lint             # Check code style
npm run type-check       # TypeScript check
```

## 🎨 Key Colors

- **Primary**: `#00d4ff` (cyan)
- **Secondary**: `#7c3aed` (purple)
- **Dark**: `#0f0f1e` (background)

## 📡 API Integration

All API calls use cached requests with 60-second TTL:

```typescript
// In components use:
const { data, isLoading } = useSmartMoneyLeaderboard(limit);
const { data, isLoading } = useSmartMoneyNetflows(period);
const { data, isLoading } = useSmartMoneyDexTrades(period, limit);
```

## 🔐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_NANSEN_API_KEY=xxxxx
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_APP_DOMAIN=smartflow.com
```

## 📊 Pages Overview

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Landing page | ✅ Complete |
| `/dashboard` | Stats & top 10 | ✅ Complete |
| `/leaderboard` | Top 100 traders | ✅ Complete |
| `/alerts` | Opportunities | ✅ Complete |

## 🎯 Component Usage Examples

### StatCard
```tsx
<StatCard
  label="Win Rate"
  value="75.5%"
  icon={<TrendingUp className="w-5 h-5" />}
  change={0.15}
/>
```

### Header
```tsx
<Header />
```

### WalletConnect
```tsx
<WalletConnect />
```

## 🗂️ State Management

```typescript
// In any component
import { useAppStore } from '@/lib/store';

const { user, isSignedIn, currentView } = useAppStore();
```

## 🎬 Animation Patterns

```tsx
// Use Framer Motion for animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  className="..."
>
  Content
</motion.div>
```

## 🌐 Deployment

### Local Testing
```bash
npm run dev
# Opens http://localhost:3000
```

### Vercel Deploy
```bash
vercel deploy
```

### With Custom Domain
```bash
vercel deploy --prod --alias smartflow.com
```

## 📚 Documentation

- **README.md** - Full documentation
- **SUMMARY.md** - Project overview
- **.env.local** - Configuration

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| No data loading | Check API key in `.env.local` |
| Styling looks off | Run `npm install` to get Tailwind |
| Build fails | Delete `.next` and rebuild |
| Port 3000 in use | Use `npm run dev -- -p 3001` |

## 🔗 Useful Links

- [Nansen API Docs](https://docs.nansen.ai)
- [Farcaster Guide](https://docs.farcaster.xyz)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com)

## 💡 Tips

- Use `@/` alias to import from root
- Check browser console for errors
- Use React DevTools to debug state
- Test responsive design with `npm run dev`
- Clear cache: `rm -rf .next && npm run build`

---

**Version**: 1.0.0  
**Built**: November 2024  
**Status**: ✅ Production Ready

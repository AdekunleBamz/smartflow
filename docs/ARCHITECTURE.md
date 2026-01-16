# SmartFlow Architecture

## Overview

SmartFlow is a Next.js 14+ application using the App Router for smart money tracking and analysis.

## Tech Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Strict mode enabled
- **Tailwind CSS 3.4**: Utility-first CSS with custom theme
- **Framer Motion**: Animation library

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state and caching

### Web3
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: TypeScript-first Web3 library
- **Farcaster miniapp-sdk**: Farcaster integration

## Directory Structure

```
smartflow/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard page
│   ├── leaderboard/       # Leaderboard page
│   ├── alerts/            # Alerts page
│   └── wallet/[address]/  # Dynamic wallet page
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── leaderboard/      # Leaderboard components
│   ├── alerts/           # Alert components
│   └── providers/        # Context providers
│
├── hooks/                # Custom React hooks
│   ├── useSmartMoney.ts
│   ├── useBrowser.ts
│   └── useUtilities.ts
│
├── lib/                  # Utility libraries
│   ├── constants.ts      # App constants
│   ├── types.ts          # TypeScript definitions
│   ├── utils.ts          # Utility functions
│   ├── validation.ts     # Input validation
│   ├── formatters.ts     # Data formatting
│   ├── api-client.ts     # API client
│   ├── store.ts          # Zustand stores
│   └── queries.ts        # React Query hooks
│
└── public/               # Static assets
    ├── favicon.ico
    └── icons/
```

## Design Patterns

### Component Architecture
- Compound components for complex UI
- Render props for flexibility
- Custom hooks for logic reuse

### State Management Strategy
- **Local state**: useState for UI state
- **Global state**: Zustand for app state
- **Server state**: React Query for API data

### API Layer
- Centralized API client with retry logic
- TypeScript types for all endpoints
- Error handling with custom error classes

## Performance Optimizations

1. **Code Splitting**: Dynamic imports for routes
2. **Image Optimization**: Next.js Image component
3. **Memoization**: useMemo/useCallback for expensive operations
4. **Virtual Lists**: For large data sets
5. **Caching**: React Query with smart cache policies

## Security Considerations

- Input validation on all user inputs
- XSS prevention with proper escaping
- CSP headers configured
- Wallet signatures for authentication

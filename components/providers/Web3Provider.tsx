// Web3 provider with wagmi and viem
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  ssr: true,
});

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Export config for external use
export { config as wagmiConfig };

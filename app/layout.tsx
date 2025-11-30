'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FarcasterSDKInit } from '@/components/FarcasterSDKInit';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SmartFlow - Smart Money Tracking on Base</title>
        <meta name="description" content="Track smart money moves on Base chain in real-time" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <FarcasterSDKInit />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

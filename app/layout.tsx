'use client';

import React, { ReactNode } from 'react';
import { QueryProvider, ThemeProvider, Web3Provider } from '@/components/providers';
import { FarcasterSDKInit } from '@/components/FarcasterSDKInit';
import { Header } from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SmartFlow - Smart Money Tracking on Base</title>
        <meta name="description" content="Track smart money moves on Base chain in real-time" />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="bg-background text-text-primary min-h-screen">
        <FarcasterSDKInit />
        <ThemeProvider defaultTheme="dark">
          <Web3Provider>
            <QueryProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </QueryProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Home page - rebuilt with enhanced hero and features
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  TrendingUp, 
  Bell, 
  Shield, 
  BarChart3, 
  Wallet,
  ArrowRight,
  Github,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Money Leaderboard',
    description: 'Track the top 5,000 performing traders ranked by profit, win rate, and trade volume.',
    color: 'text-profit',
  },
  {
    icon: BarChart3,
    title: 'Real-time Netflows',
    description: 'Monitor token inflows and outflows from smart money wallets as they happen.',
    color: 'text-primary',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description: 'Get notified instantly when whales move or specific conditions are met.',
    color: 'text-warning',
  },
  {
    icon: Shield,
    title: 'On-chain Analysis',
    description: 'Deep dive into wallet histories, trading patterns, and profit/loss metrics.',
    color: 'text-accent',
  },
  {
    icon: Wallet,
    title: 'Wallet Tracking',
    description: 'Follow any wallet and receive updates on their trading activity.',
    color: 'text-success',
  },
  {
    icon: Zap,
    title: 'Base Chain Native',
    description: 'Built specifically for Base chain with optimized data feeds and low latency.',
    color: 'text-info',
  },
];

const stats = [
  { value: '5K+', label: 'Wallets Tracked' },
  { value: '$2.5B+', label: 'Volume Analyzed' },
  { value: '100K+', label: 'Transactions/Day' },
  { value: '99.9%', label: 'Uptime' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container-main py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <img src="/logo.svg" alt="SmartFlow" className="w-16 h-16 md:w-20 md:h-20" />
              <h1 className="text-5xl md:text-7xl font-bold gradient-text">
                SmartFlow
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto"
            >
              Real-time smart money intelligence on Base chain. Track top traders, 
              identify opportunities, and move with the whales.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 group">
                  <Zap className="h-5 w-5" />
                  Launch App
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="secondary" size="lg" className="gap-2">
                  <TrendingUp className="h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-tertiary">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Trade Smarter
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Powerful tools and real-time data to help you follow the smart money 
              and make informed trading decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full card-hover">
                  <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 md:p-12 text-center glass">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Follow the Smart Money?
              </h2>
              <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                Join thousands of traders using SmartFlow to track whale movements 
                and identify profitable opportunities on Base chain.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Get Started for Free
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="SmartFlow" className="w-6 h-6" />
              <span className="font-semibold">SmartFlow</span>
              <span className="text-text-tertiary text-sm">© 2024-2026</span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

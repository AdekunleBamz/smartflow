'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  Github, 
  Twitter, 
  Send, 
  Globe,
  Heart,
  ExternalLink
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  showSocials?: boolean;
  showNewsletter?: boolean;
  companyName?: string;
  className?: string;
}

const defaultSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tutorials', href: '/tutorials' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press Kit', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  },
];

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Telegram', icon: Send, href: 'https://t.me' },
  { name: 'Discord', icon: Globe, href: 'https://discord.gg' },
];

export function Footer({
  sections = defaultSections,
  showSocials = true,
  showNewsletter = true,
  companyName = 'SmartFlow',
  className,
}: FooterProps) {
  return (
    <footer className={cn('border-t border-white/5 bg-black/20', className)}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-lg font-bold text-white">{companyName}</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Track smart money movements and make informed decisions with real-time blockchain analytics.
            </p>
            
            {/* Social Links */}
            {showSocials && (
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="border-t border-white/5 pt-8 mb-8">
            <div className="max-w-md">
              <h4 className="text-sm font-semibold text-white mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates on smart money movements and market insights.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    'flex-1 px-4 py-2 rounded-lg text-sm',
                    'bg-white/5 border border-white/10 text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  )}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500" /> by the {companyName} team
          </p>
        </div>
      </div>
    </footer>
  );
}

// Minimal footer variant
export function FooterMinimal({
  companyName = 'SmartFlow',
  className,
}: {
  companyName?: string;
  className?: string;
}) {
  return (
    <footer className={cn('border-t border-white/5 py-6', className)}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} {companyName}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

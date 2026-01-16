// SEO metadata utilities
import { Metadata } from 'next';
import { APP_NAME } from './constants';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const defaults = {
  title: `${APP_NAME} - Smart Money Tracking on Base`,
  description: 'Track smart money moves on Base chain in real-time. Follow top traders, monitor whale activity, and identify profitable opportunities.',
  image: '/og-image.svg',
  url: 'https://smartflow.app',
};

export function generateMetadata({
  title,
  description = defaults.description,
  image = defaults.image,
  url = defaults.url,
  type = 'website',
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : defaults.title;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: APP_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/icon-192.svg',
    },
    manifest: '/manifest.json',
    themeColor: '#0ea5e9',
  };
}

// JSON-LD structured data
export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_NAME,
    description: defaults.description,
    url: defaults.url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  itemClassName?: string;
}

export function Breadcrumb({
  items,
  separator,
  showHome = true,
  homeHref = '/',
  className,
  itemClassName,
}: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  const SeparatorComponent = separator || (
    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && SeparatorComponent}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5',
                    'text-sm text-gray-400 hover:text-white',
                    'transition-colors duration-200',
                    itemClassName
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5',
                    'text-sm',
                    isLast ? 'text-white font-medium' : 'text-gray-400',
                    itemClassName
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Hook for generating breadcrumbs from pathname
export function useBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    
    return {
      label,
      href: index < segments.length - 1 ? href : undefined,
    };
  });
}

// Compact breadcrumb with ellipsis for long paths
interface CompactBreadcrumbProps extends BreadcrumbProps {
  maxItems?: number;
}

export function CompactBreadcrumb({
  items,
  maxItems = 3,
  ...props
}: CompactBreadcrumbProps) {
  if (items.length <= maxItems) {
    return <Breadcrumb items={items} {...props} />;
  }

  const first = items[0];
  const last = items.slice(-maxItems + 1);
  const compactItems: BreadcrumbItem[] = [
    first,
    { label: '...' },
    ...last,
  ];

  return <Breadcrumb items={compactItems} {...props} />;
}

export default Breadcrumb;

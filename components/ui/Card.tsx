'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'gradient';
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = 'default',
  hoverable = false,
  onClick,
}: CardProps) {
  const variants = {
    default: 'glass border-white/10',
    highlight: 'glass border-accent/30 bg-gradient-to-br from-accent/5 to-purple-600/5',
    gradient: 'gradient-border',
  };

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { scale: 1.02, y: -3 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-xl p-5 border transition-all duration-200',
        variants[variant],
        hoverable && 'cursor-pointer hover:border-white/20 hover:shadow-glow-sm',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center justify-between mt-4 pt-4 border-t border-white/10', className)}>
      {children}
    </div>
  );
}

// Gradient text component
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  gradient?: 'primary' | 'secondary' | 'rainbow' | 'gold';
}

const gradients = {
  primary: 'from-primary via-accent to-primary',
  secondary: 'from-purple-400 via-pink-500 to-red-500',
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  gold: 'from-yellow-400 via-amber-500 to-yellow-600',
};

export function GradientText({
  children,
  className,
  animate = false,
  gradient = 'primary',
}: GradientTextProps) {
  const baseClass = cn(
    'bg-gradient-to-r bg-clip-text text-transparent',
    gradients[gradient],
    animate && 'bg-[length:200%_auto] animate-gradient',
    className
  );

  if (animate) {
    return (
      <motion.span
        className={baseClass}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </motion.span>
    );
  }

  return <span className={baseClass}>{children}</span>;
}

// Shimmer effect text
export function ShimmerText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-block overflow-hidden',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </span>
  );
}

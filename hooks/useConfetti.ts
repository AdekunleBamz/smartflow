'use client';

import { useCallback, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  colors?: string[];
  origin?: { x: number; y: number };
  duration?: number;
}

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);

  const createCanvas = useCallback(() => {
    if (canvasRef.current) return canvasRef.current;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    return canvas;
  }, []);

  const removeCanvas = useCallback(() => {
    if (canvasRef.current) {
      document.body.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
  }, []);

  const fire = useCallback((options: ConfettiOptions = {}) => {
    const {
      particleCount = 100,
      spread = 70,
      startVelocity = 30,
      decay = 0.94,
      gravity = 1,
      colors = DEFAULT_COLORS,
      origin = { x: 0.5, y: 0.5 },
      duration = 3000,
    } = options;

    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create particles
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
      const velocity = startVelocity * (0.5 + Math.random() * 0.5);

      newParticles.push({
        x: origin.x * canvas.width,
        y: origin.y * canvas.height,
        vx: Math.sin(angle) * velocity * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.cos(angle) * velocity - Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= decay;
        p.vy *= decay;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.01;

        if (p.opacity <= 0) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();

        return p.y < canvas.height + 50;
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        removeCanvas();
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup after duration
    setTimeout(() => {
      if (particlesRef.current.length === 0) {
        removeCanvas();
      }
    }, duration);
  }, [createCanvas, removeCanvas]);

  const celebrate = useCallback(() => {
    // Fire multiple bursts
    fire({ origin: { x: 0.25, y: 0.6 }, particleCount: 50 });
    setTimeout(() => fire({ origin: { x: 0.75, y: 0.6 }, particleCount: 50 }), 150);
    setTimeout(() => fire({ origin: { x: 0.5, y: 0.4 }, particleCount: 75 }), 300);
  }, [fire]);

  return { fire, celebrate };
}

export default useConfetti;

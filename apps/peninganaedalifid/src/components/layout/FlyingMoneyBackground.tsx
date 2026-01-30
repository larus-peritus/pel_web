'use client';

import { useMemo } from 'react';
import Image from 'next/image';

interface FlyingBill {
  id: number;
  startX: number; // Starting X position (% from left)
  startY: number; // Starting Y position (% from top, will start below viewport)
  size: number; // Size multiplier
  duration: number; // Animation duration in seconds
  delay: number; // Animation delay in seconds
  flapSpeed: number; // How fast the "flapping" oscillation is
  flapAmount: number; // How much vertical oscillation
  opacity: number; // Transparency
  rotation: number; // Base rotation angle
}

interface FlyingMoneyBackgroundProps {
  billCount?: number;
  className?: string;
}

/**
 * Animated background with flying money bills
 * Bills fly from bottom-left to upper-right with a flapping motion
 */
export function FlyingMoneyBackground({
  billCount = 12,
  className = '',
}: FlyingMoneyBackgroundProps) {
  // Generate random bill configurations (memoized to prevent re-generation on re-render)
  const bills = useMemo<FlyingBill[]>(() => {
    return Array.from({ length: billCount }, (_, i) => ({
      id: i,
      // Spread starting positions across the left side and bottom
      startX: -10 + Math.random() * 40, // -10% to 30% from left
      startY: 100 + Math.random() * 30, // Start below viewport (100-130%)
      size: 1.2 + Math.random() * 1.0, // 120-220% of base size (bigger)
      duration: 12 + Math.random() * 10, // 12-22 seconds to cross
      delay: Math.random() * 15, // Staggered start (0-15s delay)
      flapSpeed: 0.8 + Math.random() * 0.6, // Flap frequency variation
      flapAmount: 15 + Math.random() * 20, // 15-35px vertical oscillation
      opacity: 0.4 + Math.random() * 0.35, // 40-75% opacity (more visible)
      rotation: -30 + Math.random() * 20, // -30 to -10 degrees (tilted for flight direction)
    }));
  }, [billCount]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {bills.map((bill) => (
        <div
          key={bill.id}
          className="absolute animate-fly-money"
          style={{
            left: `${bill.startX}%`,
            bottom: `-${bill.startY - 100}%`,
            opacity: bill.opacity,
            animationDuration: `${bill.duration}s`,
            animationDelay: `${bill.delay}s`,
            // CSS custom properties for the keyframe animation
            '--fly-flap-speed': bill.flapSpeed,
            '--fly-flap-amount': `${bill.flapAmount}px`,
            '--fly-rotation': `${bill.rotation}deg`,
          } as React.CSSProperties}
        >
          <div
            className="animate-flap"
            style={{
              animationDuration: `${1.2 / bill.flapSpeed}s`,
            }}
          >
            <Image
              src="/logo-v2.png"
              alt=""
              width={120}
              height={120}
              className="w-auto h-auto"
              style={{
                width: `${bill.size * 80}px`,
                height: 'auto',
                transform: `rotate(${bill.rotation}deg)`,
              }}
              priority={false}
            />
          </div>
        </div>
      ))}

      {/* Keyframe animations defined in style tag for dynamic values */}
      <style jsx global>{`
        @keyframes fly-money {
          0% {
            transform: translate(0, 0);
          }
          100% {
            /* Move diagonally: right and up */
            transform: translate(120vw, -120vh);
          }
        }

        @keyframes flap {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            /* Dip down mid-flap */
            transform: translateY(var(--fly-flap-amount, 20px));
          }
        }

        .animate-fly-money {
          animation: fly-money linear infinite;
          will-change: transform;
        }

        .animate-flap {
          animation: flap ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

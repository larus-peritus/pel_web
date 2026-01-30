'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleExport = () => {
    // Placeholder - will be implemented in data export feature
    console.log('Export clicked');
  };

  const handleImport = () => {
    // Placeholder - will be implemented in data import feature
    console.log('Import clicked');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={cn(
        'border-b border-neutral-200 bg-white shadow-sm',
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Logo/Title - Links to Raunverulegt Tímakaup (home page) */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Fara á forsíðu - Raunverulegt tímakaup"
          >
            <Image
              src="/logo-v2.png"
              alt="Peningana eða lífið logo"
              width={72}
              height={72}
              className="h-[60px] w-auto md:h-[72px]"
              priority
            />
            <h1 className="text-lg font-bold text-primary-700 md:text-xl lg:text-2xl">
              Peningana eða lífið
            </h1>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden items-center gap-3 md:flex">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              aria-label="Flytja út gögn"
            >
              Flytja út
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleImport}
              aria-label="Flytja inn gögn"
            >
              Flytja inn
            </Button>
          </nav>

          {/* Mobile Menu Button - Hidden on desktop */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Opna/loka valmynd"
          >
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Shown when hamburger is clicked */}
        {isMobileMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleExport}
                className="w-full"
                aria-label="Flytja út gögn"
              >
                Flytja út
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleImport}
                className="w-full"
                aria-label="Flytja inn gögn"
              >
                Flytja inn
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

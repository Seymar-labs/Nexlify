"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/image', label: 'Image Tools' },
    { href: '/video', label: 'Video Tools' },
    { href: '/pdf', label: 'PDF Tools' },
    { href: '/converters', label: 'Converters' },
  ];

  const baseNavClasses = 'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300';
  const activeNavClasses = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
  const inactiveNavClasses = 'text-slate-300 hover:text-white hover:bg-white/5';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      {/* Purple gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image 
                src="/images/logo.png" 
                alt="Nexlify Logo" 
                width={36} 
                height={36}
                className="w-9 h-9 object-contain rounded-lg"
              />
              {/* Purple glow effect */}
              <div className="absolute inset-0 rounded-lg bg-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold text-white font-['Manrope']">
              <span className="text-gradient">Nexlify</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={baseNavClasses + ' ' + (pathname === link.href ? activeNavClasses : inactiveNavClasses)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white transition-all duration-300"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="glass-button px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <span>Get Started</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
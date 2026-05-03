"use client";

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Products',
      links: [
        { label: 'Image Tools', href: '/image' },
        { label: 'Video Tools', href: '/video' },
        { label: 'PDF Tools', href: '/pdf' },
        { label: 'Converters', href: '/converters' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image 
                src="/images/logo.png" 
                alt="Nexlify Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="text-xl font-bold text-white font-['Manrope']">
                <span className="text-gradient">Nexlify</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              The ultimate engine for high-performance digital assets. 
              Process, convert, and optimize your files instantly.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition-all">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition-all">
                <span className="material-symbols-outlined text-sm">code</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-500/20 hover:text-purple-400 transition-all">
                <span className="material-symbols-outlined text-sm">forum</span>
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-purple-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600">
            &copy; {currentYear} Nexlify. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600">Made with</span>
            <span className="text-red-500">❤</span>
            <span className="text-slate-600">for creators everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
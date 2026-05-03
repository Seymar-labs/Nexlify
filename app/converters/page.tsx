"use client";

import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';

const converterTools = [
  {
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format with quality options.',
    icon: 'transform',
    href: '/converters/png-to-jpg',
    color: 'blue',
    status: 'available',
  },
  {
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format.',
    icon: 'transform',
    href: '/converters/jpg-to-png',
    color: 'indigo',
    status: 'coming',
  },
  {
    title: 'Image to PDF',
    description: 'Convert images to PDF documents.',
    icon: 'picture_as_pdf',
    href: '/converters/image-to-pdf',
    color: 'violet',
    status: 'coming',
  },
  {
    title: 'PDF to Image',
    description: 'Extract images from PDF documents.',
    icon: 'image',
    href: '/converters/pdf-to-image',
    color: 'purple',
    status: 'coming',
  },
  {
    title: 'WebP Converter',
    description: 'Convert to WebP format for web optimization.',
    icon: 'web',
    href: '/converters/webp',
    color: 'fuchsia',
    status: 'coming',
  },
  {
    title: 'HEIC Converter',
    description: 'Convert HEIC images to standard formats.',
    icon: 'photo_library',
    href: '/converters/heic',
    color: 'pink',
    status: 'coming',
  },
];

export default function ConvertersPage() {
  const availableTools = converterTools.filter(t => t.status === 'available');
  const comingSoonTools = converterTools.filter(t => t.status === 'coming');

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <nav className="flex text-sm text-slate-500 gap-2 items-center mb-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-purple-400">Converters</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-['Manrope'] mb-4">
              <span className="text-gradient">Converters</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Convert between file formats instantly. Transform images, documents, and media with zero quality loss.
            </p>
          </div>

          {/* Available Tools */}
          {availableTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6">Available Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTools.map((tool, index) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="glass-card p-4 group hover-lift"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${tool.color}-500/20 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-lg text-${tool.color}-400`}>
                          {tool.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{tool.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon */}
          {comingSoonTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6">Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comingSoonTools.map((tool) => (
                  <div key={tool.href} className="glass-card p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${tool.color}-500/20 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-lg text-${tool.color}-400`}>
                          {tool.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{tool.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-slate-700 text-xs text-slate-400">
                        Soon
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="glass-panel p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold text-white font-['Manrope'] mb-4">
              Need a Different Converter?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We're constantly adding new conversion tools. Request the format you need.
            </p>
            <Link href="/contact" className="glass-button px-8 py-4 rounded-xl text-lg font-semibold">
              Request Converter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
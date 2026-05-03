"use client";

import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';

const imageTools = [
  {
    title: 'Image Compressor',
    description: 'Reduce image file size by up to 90% while maintaining excellent quality. Supports JPG, PNG, WebP and more.',
    icon: 'compress',
    href: '/image/compressor',
    color: 'purple',
    features: ['Up to 90% compression', 'Lossless option', 'Batch processing', 'Format conversion'],
  },
  {
    title: 'Image Upscaler',
    description: 'Enhance image resolution up to 8x using advanced AI neural networks without quality loss.',
    icon: 'photo_size_select_large',
    href: '/image/upscaler',
    color: 'violet',
    features: ['Up to 8x upscale', 'AI enhancement', 'No artifacts', 'Fast processing'],
  },
  {
    title: 'Background Remover',
    description: 'Remove backgrounds from images automatically with edge-aware AI technology. Get clean cutouts in seconds.',
    icon: 'auto_fix_high',
    href: '/image/background-remover',
    color: 'fuchsia',
    features: ['One-click removal', 'Precise edges', 'Transparent PNG', 'Batch processing'],
  },
];

const stats = [
  { value: '10M+', label: 'Images Processed' },
  { value: '50GB+', label: 'Data Saved' },
  { value: '99.9%', label: 'Accuracy' },
  { value: '<2s', label: 'Avg. Processing Time' },
];

export default function ImageToolsPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <nav className="flex text-sm text-slate-500 gap-2 items-center mb-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-purple-400">Image Tools</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-['Manrope'] mb-4">
              <span className="text-gradient">Image Tools</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Professional image processing tools powered by advanced AI. 
              Compress, upscale, and enhance your images with precision.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-purple-400">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {imageTools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="glass-card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-${tool.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-2xl text-${tool.color}-400`}>
                    {tool.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <span key={feature} className="px-2 py-1 rounded-full bg-white/5 text-xs text-slate-400">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Use tool</span>
                  <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-panel p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Manrope'] mb-4">
              Need something else?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We're constantly adding new image processing tools. 
              Let us know what feature you'd like to see next.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact" className="glass-button px-8 py-4 rounded-xl text-lg font-semibold">
                Request Feature
              </Link>
              <Link href="/" className="glass-button-secondary px-8 py-4 rounded-xl text-lg font-semibold">
                Browse All Tools
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
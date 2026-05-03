"use client";

import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';

export default function HomePage() {
  const features = [
    { icon: 'speed', label: 'Ultra Fast Processing' },
    { icon: 'lock', label: 'Encrypted & Private' },
    { icon: 'web', label: 'Browser-Based' },
  ];

  const categories = [
    {
      title: 'Image Tools',
      description: 'Compress, resize, convert, and enhance your images with powerful AI tools.',
      icon: 'image',
      href: '/image/compressor',
      popular: true,
    },
    {
      title: 'PDF Tools',
      description: 'Merge, split, compress, and convert PDF documents effortlessly.',
      icon: 'picture_as_pdf',
      href: '/pdf/merge',
      popular: true,
    },
    {
      title: 'Video Tools',
      description: 'Convert and optimize videos for web and social media.',
      icon: 'videocam',
      href: '/video/converter',
      popular: false,
    },
  ];

  const trendingTools = [
    {
      title: 'Image Compressor',
      description: 'Reduce image file size while maintaining quality.',
      icon: 'compress',
      href: '/image/compressor',
      popular: true,
    },
    {
      title: 'Background Remover',
      description: 'Remove backgrounds from images automatically with AI.',
      icon: 'auto_fix_high',
      href: '/image/background-remover',
      newTool: true,
    },
    {
      title: 'Image Upscaler',
      description: 'Enhance image resolution up to 8x with AI.',
      icon: 'photo_size_select_large',
      href: '/image/upscaler',
      newTool: true,
    },
    {
      title: 'PDF Merger',
      description: 'Combine multiple PDF files into one document.',
      icon: 'library_add',
      href: '/pdf/merge',
      popular: true,
    },
    {
      title: 'Video Converter',
      description: 'Convert videos between all popular formats.',
      icon: 'movie_edit',
      href: '/video/converter',
    },
    {
      title: 'PDF Splitter',
      description: 'Split PDF documents into separate files.',
      icon: 'call_split',
      href: '/pdf/split',
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-16 pt-16 pb-12 px-4 md:px-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-16 md:py-24">
            {/* Animated gradient background element */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
              <h1 className="relative text-4xl md:text-5xl lg:text-7xl font-bold text-white font-['Manrope'] leading-tight">
                The ultimate engine<br />
                for <span className="text-glow">high-performance</span>
                <br />digital assets
              </h1>
            </div>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Process, compress, convert, and optimize your images, videos, and documents instantly. 
              No uploads, maximum privacy.
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {features.map((feature) => (
                <div key={feature.label} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400">{feature.icon}</span>
                  {feature.label}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/image/compressor"
                className="glass-button px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2"
              >
                <span>Start for free</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                href="/image"
                className="glass-button-secondary px-8 py-4 rounded-xl text-lg font-semibold"
              >
                Browse tools
              </Link>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Manrope'] mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="glass-card p-6 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-all">
                    <span className="material-symbols-outlined text-2xl text-slate-300 group-hover:text-purple-400 transition-all">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    {category.title}
                    {category.popular && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                        Popular
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular Tools Section */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-['Manrope']">
                Popular Tools
              </h2>
              <Link
                href="/image"
                className="text-purple-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {trendingTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="glass-card p-6 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-slate-300">{tool.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-white truncate">{tool.title}</h3>
                        {tool.popular && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                            Popular
                          </span>
                        )}
                        {tool.newTool && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Use tool</span>
                    <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12">
            <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden">
              {/* Gradient orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-['Manrope'] mb-4">
                  Ready to get started?
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Join thousands of users who trust Nexlify for their digital asset processing needs.
                </p>
                <Link
                  href="/image/compressor"
                  className="inline-block glass-button px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
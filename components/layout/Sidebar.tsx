"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  const toolCategories = [
    {
      title: 'Image Tools',
      icon: 'image',
      href: '/image',
      tools: [
        { label: 'Compressor', href: '/image/compressor' },
        { label: 'Upscaler', href: '/image/upscaler' },
        { label: 'Background Remover', href: '/image/background-remover' },
      ],
    },
    {
      title: 'Video Tools',
      icon: 'videocam',
      href: '/video',
      tools: [
        { label: 'Converter', href: '/video/converter' },
      ],
    },
    {
      title: 'PDF Tools',
      icon: 'picture_as_pdf',
      href: '/pdf',
      tools: [
        { label: 'Merge', href: '/pdf/merge' },
        { label: 'Split', href: '/pdf/split' },
      ],
    },
    {
      title: 'Converters',
      icon: 'swap_horiz',
      href: '/converters',
      tools: [
        { label: 'Image to PDF', href: '/converters/image-to-pdf' },
      ],
    },
  ];

  const trendingTools = [
    { label: 'PNG to JPG', href: '/converters/png-to-jpg', popular: true },
    { label: 'Compress PDF', href: '/pdf/compress', popular: true },
    { label: 'Remove BG', href: '/image/background-remover', popular: true },
  ];

  const activeLinkClasses = 'bg-purple-500/15 text-purple-300 font-medium border-l-2 border-purple-500';
  const inactiveLinkClasses = 'text-slate-400 hover:text-white hover:bg-white/5 hover:pl-4';

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen glass-sidebar overflow-hidden hidden lg:block transition-all duration-300 ${
        isExpanded ? 'w-72' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin Button */}
      <div className={`absolute top-20 right-0 translate-x-1/2 z-10 transition-opacity duration-300 ${
        isExpanded ? 'opacity-0' : 'opacity-100'
      }`}>
        <button
          onClick={() => setIsPinned(!isPinned)}
          className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
        >
          <span className="material-symbols-outlined text-xs text-white">{isPinned ? 'push_pin' : 'push_pin'}</span>
        </button>
      </div>

      {/* Expanded content when pinned but hover left */}
      {!isExpanded && !isHovered && !isPinned && (
        <div className="pt-20 flex flex-col items-center gap-4">
          <Link href="/image/compressor" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">compress</span>
          </Link>
          <Link href="/image/background-remover" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">auto_fix_high</span>
          </Link>
          <Link href="/pdf/merge" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">library_add</span>
          </Link>
          <Link href="/video/converter" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">movie_edit</span>
          </Link>
          <Link href="/settings" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors mt-auto">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      )}

      {/* Full sidebar content */}
      <div className={`p-4 pt-20 transition-opacity duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Pin toggle when expanded */}
        <button
          onClick={() => setIsPinned(!isPinned)}
          className="absolute top-20 right-4 flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className={`material-symbols-outlined text-sm ${isPinned ? 'text-purple-400' : ''}`}>
            {isPinned ? 'push_pin' : 'push_pin'}
          </span>
          {isPinned && <span className="text-purple-400">Pinned</span>}
        </button>

        {/* Workspace Section */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Workspace</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">PRO</span>
          </div>
          <p className="text-xs text-slate-500">Upgrade for unlimited</p>
        </div>

        {/* Trending Tools */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-3">
            <span className="material-symbols-outlined text-purple-400 text-sm">trending_up</span>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trending</h2>
          </div>
          <div className="space-y-1">
            {trendingTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  pathname === tool.href ? activeLinkClasses : inactiveLinkClasses
                }`}
              >
                <span className="flex items-center gap-2">
                  {tool.label}
                  {tool.popular && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">HOT</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Categories
          </h2>
          {toolCategories.map((category) => (
            <div key={category.href} className="mb-4">
              <Link
                href={category.href}
                className="flex items-center gap-2 px-3 py-2 text-white font-medium hover:bg-white/5 rounded-lg transition-all duration-300"
              >
                <span className="material-symbols-outlined text-lg text-purple-400">{category.icon}</span>
                {category.title}
              </Link>
              <div className="ml-4 mt-1 space-y-1">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      pathname === tool.href ? activeLinkClasses : inactiveLinkClasses
                    }`}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mt-8 pt-4 border-t border-white/5">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
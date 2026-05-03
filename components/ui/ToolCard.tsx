'use client';

import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  popular?: boolean;
  newTool?: boolean;
}

const ToolCard = ({ title, description, icon, href, popular = false, newTool = false }: ToolCardProps) => {
  const baseClasses = 'bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant hover:border-primary hover:shadow-lg transition-all group';
  const cardClass = baseClasses;

  return (
    <Link href={href} className={cardClass}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-on-surface truncate">{title}</h3>
            {popular && (
              <span className="px-2 py-0.5 text-xs font-medium bg-tertiary-container text-on-surface rounded-full">
                Popular
              </span>
            )}
            {newTool && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-container text-on-primary rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Use tool</span>
        <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
      </div>
    </Link>
  );
};

export default ToolCard;

import { Link, useLocation } from 'react-router-dom';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  path: string;
  label: string;
  matchPattern?: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'My Articles', matchPattern: '/post/' },
  { path: '/projects', label: 'My Projects', matchPattern: '/project/' },
  { path: '/speeches', label: 'Public Speeches', matchPattern: '/speech/' },
  { path: '/resume', label: 'Resume' },
  { path: '/about', label: 'About Me' },
];

export function Navigation() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.path === '/') {
      return location.pathname === '/' || (item.matchPattern && location.pathname.startsWith(item.matchPattern));
    }
    return location.pathname === item.path || (item.matchPattern && location.pathname.startsWith(item.matchPattern));
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <nav className="px-4 sm:px-6" aria-label="Main navigation">
      <div className="flex items-center justify-between">
        <ul className="flex flex-wrap gap-1 -mb-px">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`inline-block px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive(item)
                    ? 'border-[#0969da] text-[#0969da] dark:border-[#58a6ff] dark:text-[#58a6ff]'
                    : 'border-transparent text-[#57606a] hover:text-[#24292f] hover:border-[#d1d9de] dark:text-[#7d8590] dark:hover:text-[#e6edf3] dark:hover:border-[#30363d]'
                }`}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[#57606a] hover:text-[#24292f] hover:border-[#d1d9de] dark:text-[#7d8590] dark:hover:text-[#e6edf3] dark:hover:border-[#30363d] transition-colors relative w-[100px]"
          aria-label={copied ? 'Link copied to clipboard' : 'Copy link to this page'}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check size={16} className="text-[#1a7f37] dark:text-[#3fb950]" />
              <span className="text-[#1a7f37] dark:text-[#3fb950]">Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}


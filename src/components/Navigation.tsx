import { Link, useLocation } from 'react-router-dom';

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

  const isActive = (item: NavItem) => {
    if (item.path === '/') {
      return location.pathname === '/' || (item.matchPattern && location.pathname.startsWith(item.matchPattern));
    }
    return location.pathname === item.path || (item.matchPattern && location.pathname.startsWith(item.matchPattern));
  };

  return (
    <nav className="px-4 sm:px-6">
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
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}


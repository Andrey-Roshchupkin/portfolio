import { Github, Linkedin, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { config } from '../config';
import { Navigation } from './Navigation';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-[#30363d] dark:bg-[#161b22]/80 transition-colors">
      <div className="mx-auto max-w-4xl">
        {/* Top section with name, title, and actions */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-base font-semibold text-[#24292f] dark:text-[#e6edf3] tracking-tight">
              {config.name}
            </h1>
            <p className="text-xs text-[#57606a] dark:text-[#7d8590] mt-0.5">
              {config.title}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-3">
              <a 
                href={config.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#57606a] hover:text-[#0969da] dark:text-[#7d8590] dark:hover:text-[#58a6ff] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href={config.links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#57606a] hover:text-[#0969da] dark:text-[#7d8590] dark:hover:text-[#58a6ff] transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>

            <span role="separator" aria-hidden="true" className="h-5 w-px bg-gray-200 dark:bg-[#30363d]"></span>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-md p-1.5 hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors text-[#57606a] dark:text-[#7d8590]"
              title={`Theme: ${theme}`}
              aria-label={`Switch theme (current: ${theme})`}
            >
              {theme === 'light' && <Sun size={18} />}
              {theme === 'dark' && <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Visual separator - full width */}
      <hr className="w-full border-t border-[#d1d9de] dark:border-[#30363d] m-0" aria-hidden="true" />

      {/* Navigation */}
      <div className="mx-auto max-w-4xl">
        <Navigation />
      </div>
    </header>
  );
}


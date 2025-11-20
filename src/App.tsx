import { Routes, Route } from 'react-router-dom';
import { Github, Linkedin, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { config } from './config';
import { PostList } from './components/PostList';
import { PostView } from './components/PostView';

function App() {
  const { theme, setTheme } = useTheme();

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-[#30363d] dark:bg-[#161b22]/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
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

          <div className="h-5 w-px bg-gray-200 dark:bg-[#30363d]"></div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            className="rounded-md p-1.5 hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors text-[#57606a] dark:text-[#7d8590]"
            title={`Theme: ${theme}`}
            aria-label={`Switch theme (current: ${theme})`}
          >
            {theme === 'light' && <Sun size={18} />}
            {theme === 'dark' && <Moon size={18} />}
            {theme === 'system' && <Monitor size={18} />}
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-white text-[#24292f] dark:bg-[#0d1117] dark:text-[#e6edf3] transition-colors selection:bg-[#b6e3ff]/50 dark:selection:bg-[#264f78]/50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
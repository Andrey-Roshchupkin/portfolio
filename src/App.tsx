import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import { PostView } from './components/PostView';
import { ProjectList } from './components/ProjectList';
import { ProjectView } from './components/ProjectView';
import { SpeechList } from './components/SpeechList';
import { SpeechView } from './components/SpeechView';
import { About } from './components/About';
import { Resume } from './components/Resume';

function App() {

  return (
    <div className="min-h-screen bg-white text-[#24292f] dark:bg-[#0d1117] dark:text-[#e6edf3] transition-colors selection:bg-[#b6e3ff]/50 dark:selection:bg-[#264f78]/50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-3 pb-8 sm:pb-10">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostView />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/:slug" element={<ProjectView />} />
          <Route path="/speeches" element={<SpeechList />} />
          <Route path="/speech/:slug" element={<SpeechView />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
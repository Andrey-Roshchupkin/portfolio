import { Loader2 } from 'lucide-react';
import type { InitState, WebAIStatus } from './types';

interface InitializationControlsProps {
  initState: InitState;
  webAIStatus: WebAIStatus | null;
  canInitialize: boolean;
  onInitialize: () => void;
  onClear: () => void;
}

export function InitializationControls({
  initState,
  webAIStatus,
  canInitialize,
  onInitialize,
  onClear,
}: InitializationControlsProps) {
  return (
    <>
      {webAIStatus?.availability === 'downloading' && (
        <div className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-4">
          <p className="text-sm font-medium text-[#24292f] dark:text-[#e6edf3] mb-2">
            {webAIStatus.message}
          </p>
          {webAIStatus.instructions.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm text-[#57606a] dark:text-[#7d8590] mt-2">
              {webAIStatus.instructions.map((instruction, index) => (
                <li key={index} className={instruction === '' ? 'list-none my-2' : ''}>
                  {instruction}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={onInitialize}
          disabled={initState !== 'idle' || !canInitialize}
          className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors border ${
            initState === 'idle' && canInitialize
              ? 'bg-[#f6f8fa] text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] border-[#d1d9de] dark:border-[#30363d]'
              : 'bg-[#f6f8fa] text-[#57606a] border border-[#d1d9de] cursor-not-allowed opacity-50 dark:bg-[#161b22] dark:text-[#7d8590] dark:border-[#30363d]'
          }`}
          aria-label={
            initState === 'idle'
              ? canInitialize
                ? 'Download Gemini Nano model'
                : 'Model unavailable - check requirements'
              : initState === 'initializing'
              ? 'Downloading model'
              : 'Model ready'
          }
          aria-busy={initState === 'initializing'}
          title={
            !canInitialize && initState === 'idle'
              ? 'Model is unavailable. Please check the requirements above.'
              : undefined
          }
        >
          {initState === 'idle' && (webAIStatus?.availability === 'downloading' ? 'Downloading...' : 'Download')}
          {initState === 'initializing' && (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Downloading...
            </span>
          )}
          {initState === 'initialized' && 'Model is ready'}
        </button>

        <button
          onClick={onClear}
          disabled={initState !== 'initialized'}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            initState === 'initialized'
              ? 'bg-[#f6f8fa] text-[#24292f] border border-[#d1d9de] hover:bg-[#f3f4f6] dark:bg-[#161b22] dark:text-[#e6edf3] dark:border-[#30363d] dark:hover:bg-[#21262d]'
              : 'bg-[#f6f8fa] text-[#57606a] border border-[#d1d9de] cursor-not-allowed opacity-50 dark:bg-[#161b22] dark:text-[#7d8590] dark:border-[#30363d]'
          }`}
          aria-label="Clear dialog"
          aria-disabled={initState !== 'initialized'}
        >
          Clear dialog
        </button>
      </div>
    </>
  );
}


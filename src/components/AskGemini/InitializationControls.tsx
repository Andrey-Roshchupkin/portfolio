import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import type { InitState, WebAIStatus, Message } from './types';

interface InitializationControlsProps {
  initState: InitState;
  webAIStatus: WebAIStatus | null;
  canInitialize: boolean;
  hrMode: boolean;
  messages: Message[];
  onInitialize: () => void;
  onClear: () => void;
  onToggleHrMode: () => void;
}

export function InitializationControls({
  initState,
  webAIStatus,
  canInitialize,
  hrMode,
  messages,
  onInitialize,
  onClear,
  onToggleHrMode,
}: InitializationControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyConversation = async () => {
    if (messages.length === 0) return;

    const conversationText = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Gemini';
        const content = msg.content || '';
        return `${role}: ${content}`;
      })
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(conversationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy conversation:', error);
    }
  };
  return (
    <>
      {webAIStatus?.availability === 'downloading' && (
        <section 
          className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-4"
          aria-label="Model download status"
          role="status"
          aria-live="polite"
        >
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
        </section>
      )}

      <div className="flex gap-3 mb-4" role="toolbar" aria-label="Model initialization controls">
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
              ? 'bg-[#f6f8fa] text-[#24292f] border border-[#d1d9de] hover:bg-[#e1e4e8] dark:bg-[#161b22] dark:text-[#e6edf3] dark:border-[#30363d] dark:hover:bg-[#21262d]'
              : 'bg-[#f6f8fa] text-[#57606a] border border-[#d1d9de] cursor-not-allowed opacity-50 dark:bg-[#161b22] dark:text-[#7d8590] dark:border-[#30363d]'
          }`}
          aria-label="Clear dialog"
          aria-disabled={initState !== 'initialized'}
        >
          Clear dialog
        </button>

        {initState === 'initialized' && (
          <label 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] hover:bg-[#e1e4e8] dark:hover:bg-[#21262d] transition-colors"
            title={hrMode ? 'Disable HR mode' : 'Enable HR mode to evaluate job descriptions against Andrey\'s profile'}
          >
            <input
              type="checkbox"
              checked={hrMode}
              onChange={onToggleHrMode}
              className="w-4 h-4 rounded border-[#d1d9de] dark:border-[#30363d] text-[#0969da] dark:text-[#1f6feb] focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#1f6feb] cursor-pointer"
              aria-label="Toggle HR mode"
              aria-describedby="hr-mode-description"
            />
            <span id="hr-mode-description" className="text-[#24292f] dark:text-[#e6edf3]">HR Mode</span>
          </label>
        )}

        {initState === 'initialized' && messages.length > 0 && (
          <button
            onClick={handleCopyConversation}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#161b22] dark:text-[#e6edf3] dark:hover:bg-[#21262d] w-[125px]"
            aria-label={copied ? 'Chat copied to clipboard' : 'Copy chat to clipboard'}
            aria-live="polite"
            aria-atomic="true"
            title="Copy chat to clipboard"
          >
            {copied ? (
              <>
                <Check size={16} aria-hidden="true" className="text-[#1a7f37] dark:text-[#3fb950]" />
                <span className="text-[#1a7f37] dark:text-[#3fb950]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} aria-hidden="true" />
                <span>Copy chat</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}


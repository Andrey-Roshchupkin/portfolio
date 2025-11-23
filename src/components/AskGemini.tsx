import { useEffect } from 'react';
import { useWebAIStatus } from '../hooks/useWebAIStatus';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGeminiSession } from '../hooks/useGeminiSession';
import { useChatMessages } from '../hooks/useChatMessages';
import { StatusMessage } from './AskGemini/StatusMessage';
import { InitializationControls } from './AskGemini/InitializationControls';
import { ChatInterface } from './AskGemini/ChatInterface';
import { LoadingState } from './AskGemini/LoadingState';
import { DownloadingState } from './AskGemini/DownloadingState';

const STORAGE_KEYS = {
  HR_MODE: 'ask-gemini-hr-mode',
} as const;

export function AskGemini() {
  const webAIStatus = useWebAIStatus();
  const [hrMode, setHrMode] = useLocalStorage<boolean>(STORAGE_KEYS.HR_MODE, true);
  const { initState, session, createSession, clearSession } = useGeminiSession(webAIStatus);
  const { messages, isLoading, sendMessage, clearMessages } = useChatMessages(session, hrMode);

  const handleClear = async () => {
    await clearSession();
    clearMessages();
  };

  const handleToggleHrMode = () => {
    setHrMode((prev) => !prev);
  };

  // Keep focus on textarea when not loading
  useEffect(() => {
    if (!isLoading && initState === 'initialized') {
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        textarea?.focus();
      }, 100);
    }
  }, [isLoading, initState]);

  if (!webAIStatus) {
    return <LoadingState />;
  }

  // If not Chrome, show only message without buttons
  if (!webAIStatus.isChrome) {
    return (
      <section className="space-y-6" aria-label="Ask Gemini">
        <StatusMessage status={webAIStatus} />
      </section>
    );
  }

  // For Chrome, allow initialization even if unavailable - model might need to be downloaded
  const canInitialize = webAIStatus.isChrome && initState === 'idle';

  return (
    <section className="space-y-6" aria-label="Ask Gemini">
      {webAIStatus.availability === 'unavailable' && !webAIStatus.isAvailable && (
        <StatusMessage status={webAIStatus} />
      )}

      <InitializationControls
        initState={initState}
        webAIStatus={webAIStatus}
        canInitialize={canInitialize}
        hrMode={hrMode}
        messages={messages}
        onInitialize={createSession}
        onClear={handleClear}
        onToggleHrMode={handleToggleHrMode}
      />

      {initState === 'initialized' ? (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          hrMode={hrMode}
          onSend={sendMessage}
        />
      ) : (
        <DownloadingState initState={initState} />
      )}
    </section>
  );
}

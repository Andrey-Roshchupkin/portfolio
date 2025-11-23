import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Message } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  hrMode: boolean;
  onSend: (text: string, image: File | null) => void;
}

export function ChatInterface({ messages, isLoading, hrMode, onSend }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[600px] rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
      {/* Messages area */}
      <section 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#57606a] dark:text-[#7d8590] text-center max-w-md">
              {hrMode ? (
                <>
                  HR Mode is active. To check if your vacancy matches Andrey's profile, send the job description to the chat.
                </>
              ) : (
                'Start a conversation with Gemini Nano'
              )}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-[#f6f8fa] text-[#24292f] dark:bg-[#161b22] dark:text-[#e6edf3]">
                  <div className="flex items-center gap-2" role="status" aria-live="polite">
                    <Loader2 className="animate-spin text-[#57606a] dark:text-[#7d8590]" size={20} aria-hidden="true" />
                    <span className="text-sm text-[#57606a] dark:text-[#7d8590]">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </section>

      {/* Input area */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}


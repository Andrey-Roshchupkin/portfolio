import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Message } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string, image: File | null) => void;
}

export function ChatInterface({ messages, isLoading, onSend }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[600px] rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-white dark:bg-[#0d1117]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#57606a] dark:text-[#7d8590] text-center">
              Start a conversation with Gemini Nano
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#f6f8fa] dark:bg-[#161b22] rounded-lg p-3">
                  <Loader2 className="animate-spin text-[#57606a] dark:text-[#7d8590]" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}


import { useState, useCallback } from 'react';
import type { Message } from '../components/AskGemini/types';
import { useLocalStorage } from './useLocalStorage';
import hrModePrompt from '../components/AskGemini/hr-mode-prompt.txt?raw';

const HR_MODE_PROMPT = hrModePrompt.trim();

const STORAGE_KEYS = {
  MESSAGES: 'ask-gemini-messages',
} as const;

export function useChatMessages(session: any, hrMode: boolean) {
  const [messages, setMessages] = useLocalStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string, image: File | null) => {
    if (!session || (!text && !image) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      image: image ? URL.createObjectURL(image) : undefined,
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let promptContent: string | Array<{ role: 'user'; content: string | Array<{ type: 'text' | 'image'; value: string | File }> }>;
      
      // If HR mode is enabled and this is the first message, prepend system prompt to user text
      const isFirstMessage = messages.length === 0;
      let finalText = text;
      if (hrMode && isFirstMessage && text) {
        finalText = `${HR_MODE_PROMPT}\n\n---\n\nUser message: ${text}`;
      }
      
      if (image && finalText) {
        promptContent = [
          {
            role: 'user',
            content: [
              { type: 'text', value: finalText },
              { type: 'image', value: image },
            ],
          },
        ];
      } else if (image) {
        promptContent = [
          {
            role: 'user',
            content: [{ type: 'image', value: image }],
          },
        ];
      } else {
        promptContent = finalText;
      }

      const response = await session.prompt(promptContent);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [session, hrMode, messages.length, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      } catch (error) {
        console.error('Failed to clear messages from localStorage:', error);
      }
    }
  }, [setMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    setMessages,
  };
}


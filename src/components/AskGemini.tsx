import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { checkWebAIRequirements } from './AskGemini/utils';
import { StatusMessage } from './AskGemini/StatusMessage';
import { InitializationControls } from './AskGemini/InitializationControls';
import { ChatInterface } from './AskGemini/ChatInterface';
import type { InitState, Message, WebAIStatus } from './AskGemini/types';

// TypeScript types for LanguageModel API
declare global {
  interface Window {
    LanguageModel?: {
      availability(): Promise<'readily' | 'available' | 'downloading' | 'downloadable' | 'unavailable'>;
      params(): Promise<{
        defaultTopK: number;
        maxTopK: number;
        defaultTemperature: number;
        maxTemperature: number;
      }>;
      create(options?: {
        monitor?: (monitor: {
          addEventListener: (type: string, listener: (e: any) => void) => void;
        }) => void;
        temperature?: number;
        topK?: number;
        signal?: AbortSignal;
        initialPrompts?: Array<{
          role: 'system' | 'user' | 'assistant';
          content: string;
        }>;
        expectedInputs?: Array<{
          type: 'text' | 'image' | 'audio';
          languages?: string[];
        }>;
        expectedOutputs?: Array<{
          type: 'text';
          languages?: string[];
        }>;
      }): Promise<{
        prompt(prompt: string | Array<{ role: 'user'; content: string | Array<{ type: 'text' | 'image'; value: string | File }> }>, options?: {
          signal?: AbortSignal;
          responseConstraint?: any;
          omitResponseConstraintInput?: boolean;
        }): Promise<string>;
        promptStreaming(prompt: string, options?: {
          signal?: AbortSignal;
          responseConstraint?: any;
          omitResponseConstraintInput?: boolean;
        }): ReadableStream<string>;
        append(messages: Array<{
          role: 'user' | 'assistant';
          content: string | Array<{
            type: 'text' | 'image';
            value: string | File;
          }>;
        }>): Promise<void>;
        clone(options?: {
          signal?: AbortSignal;
        }): Promise<any>;
        destroy(): Promise<void>;
        inputUsage: number;
        inputQuota: number;
      }>;
    };
  }
}

export function AskGemini() {
  const [webAIStatus, setWebAIStatus] = useState<WebAIStatus | null>(null);
  const [initState, setInitState] = useState<InitState>('idle');
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkWebAIRequirements().then(setWebAIStatus);
  }, []);

  // Auto-initialize if model is ready
  useEffect(() => {
    const autoInit = async () => {
      if (
        webAIStatus?.isChrome &&
        window.LanguageModel &&
        (webAIStatus.availability === 'readily' || webAIStatus.availability === 'available') &&
        initState === 'idle' &&
        !session
      ) {
        setInitState('initializing');

        // Start status monitoring every 30 seconds
        let statusInterval: number | null = null;

        const checkStatus = async () => {
          try {
            if (window.LanguageModel) {
              await window.LanguageModel.availability();
            }
          } catch (error) {
            console.error('Error checking model availability:', error);
          }
        };

        // Check immediately and then every 30 seconds
        checkStatus();
        statusInterval = window.setInterval(checkStatus, 30000);

        // Add timeout to detect if create() hangs
        const timeoutId = window.setTimeout(() => {
          console.warn('Model initialization is taking longer than 5 minutes. This might indicate a problem.');
        }, 300000); // 5 minutes

        try {
          const textSession = await window.LanguageModel.create({
            monitor(m) {
              // Listen to download progress events
              const eventTypes = ['downloadprogress', 'progress'];
              
              eventTypes.forEach(eventType => {
                try {
                  m.addEventListener(eventType, () => {
                    // Progress events are handled silently
                  });
                } catch (err) {
                  // Some event types might not be supported
                }
              });
            },
            expectedInputs: [
              { type: 'text', languages: ['en'] },
              { type: 'image' },
            ],
            expectedOutputs: [
              { type: 'text', languages: ['en'] },
            ],
          });

          window.clearTimeout(timeoutId);
          setSession(textSession);
          setInitState('initialized');
        } catch (error) {
          console.error('Failed to auto-initialize Gemini Nano:', error);
          window.clearTimeout(timeoutId);
          setInitState('idle');
        } finally {
          // Clean up status monitoring interval
          if (statusInterval) {
            window.clearInterval(statusInterval);
            statusInterval = null;
          }
        }
      }
    };
    autoInit();
  }, [webAIStatus?.availability, initState, session]);

  const handleInitialize = async () => {
    if (initState !== 'idle') return;

    // Check if LanguageModel is available
    if (!window.LanguageModel) {
      const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1];
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      
      let message = 'LanguageModel API is not available.\n\n';
      
      if (!isChrome) {
        message += 'Please use Google Chrome browser.';
      } else if (chromeVersion && parseInt(chromeVersion) < 138) {
        message += `Your Chrome version (${chromeVersion}) is too old. Please update to Chrome 138 or later.`;
      } else {
        message += 'Please make sure:\n';
        message += '1. You are using Chrome 138 or later\n';
        message += '2. The flag #prompt-api-for-gemini-nano-multimodal-input is enabled in chrome://flags/\n';
        message += '3. Chrome has been restarted after enabling the flag\n';
        message += '4. You are accessing the site via localhost or HTTPS';
      }
      
      alert(message);
      return;
    }

    setInitState('initializing');

    // Start status monitoring every 30 seconds
    let statusInterval: number | null = null;

    const checkStatus = async () => {
      try {
        if (window.LanguageModel) {
          await window.LanguageModel.availability();
        }
      } catch (error) {
        console.error('Error checking model availability:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkStatus();
    statusInterval = window.setInterval(checkStatus, 30000);

    // Add timeout to detect if create() hangs
    const timeoutId = window.setTimeout(() => {
      console.warn('Model initialization is taking longer than 5 minutes. This might indicate a problem.');
    }, 300000); // 5 minutes

    try {
      const textSession = await window.LanguageModel.create({
        monitor(m) {
          // Listen to download progress events
          const eventTypes = ['downloadprogress', 'progress'];
          
          eventTypes.forEach(eventType => {
            try {
              m.addEventListener(eventType, () => {
                // Progress events are handled silently
              });
            } catch (err) {
              // Some event types might not be supported
            }
          });
        },
        expectedInputs: [
          { type: 'text', languages: ['en'] },
          { type: 'image' },
        ],
        expectedOutputs: [
          { type: 'text', languages: ['en'] },
        ],
      });

      window.clearTimeout(timeoutId);
      setSession(textSession);
      setInitState('initialized');
    } catch (error) {
      console.error('Failed to initialize Gemini Nano:', error);
      window.clearTimeout(timeoutId);
      setInitState('idle');
      alert(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Clean up status monitoring interval
      if (statusInterval) {
        window.clearInterval(statusInterval);
        statusInterval = null;
      }
    }
  };

  const handleClear = async () => {
    if (session) {
      try {
        await session.destroy();
        
        if (window.LanguageModel) {
          const newSession = await window.LanguageModel.create({
            expectedInputs: [
              { type: 'text', languages: ['en'] },
              { type: 'image' },
            ],
            expectedOutputs: [
              { type: 'text', languages: ['en'] },
            ],
          });
          setSession(newSession);
        }
        
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear session:', error);
        setSession(null);
        setInitState('idle');
        setMessages([]);
      }
    }
  };

  const handleSend = async (text: string, image: File | null) => {
    if (!session || (!text && !image) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      image: image ? URL.createObjectURL(image) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let promptContent: string | Array<{ role: 'user'; content: string | Array<{ type: 'text' | 'image'; value: string | File }> }>;
      
      if (image && text) {
        promptContent = [
          {
            role: 'user',
            content: [
              { type: 'text', value: text },
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
        promptContent = text;
      }

      const response = await session.prompt(promptContent);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    return (
      <section className="space-y-6" aria-label="Ask Gemini">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[#57606a] dark:text-[#7d8590]" size={24} />
        </div>
      </section>
    );
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
  // Only disable if explicitly unavailable AND not Chrome, or if already initializing/initialized
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
        onInitialize={handleInitialize}
        onClear={handleClear}
      />

      {initState === 'initialized' ? (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
        />
      ) : (
        <div className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-6 min-h-[400px]">
          {initState === 'idle' && (
            <p className="text-sm text-[#57606a] dark:text-[#7d8590] text-center">
              Click "Download" to start
            </p>
          )}
          {initState === 'initializing' && (
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-[#24292f] dark:text-[#e6edf3]">
                Downloading model...
              </p>
              <div className="text-sm text-[#57606a] dark:text-[#7d8590] space-y-1">
                <p>Download time depends on your internet speed:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>50 Mbit/s: ~40 minutes</li>
                  <li>100 Mbit/s: ~20 minutes</li>
                  <li>200 Mbit/s: ~10 minutes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

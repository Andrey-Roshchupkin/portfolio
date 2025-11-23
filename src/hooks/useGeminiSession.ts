import { useState, useEffect, useCallback } from 'react';
import type { InitState, WebAIStatus } from '../components/AskGemini/types';

// TypeScript types for LanguageModel API
declare global {
  interface Window {
    LanguageModel?: {
      availability(): Promise<'readily' | 'available' | 'downloading' | 'downloadable' | 'unavailable'>;
      create(options?: {
        monitor?: (monitor: {
          addEventListener: (type: string, listener: (e: any) => void) => void;
        }) => void;
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
        destroy(): Promise<void>;
      }>;
    };
  }
}

export function useGeminiSession(webAIStatus: WebAIStatus | null) {
  const [initState, setInitState] = useState<InitState>('idle');
  const [session, setSession] = useState<any>(null);

  const createSession = useCallback(async () => {
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
        message += '2. Open chrome://flags/#prompt-api-for-gemini-nano-multimodal-input and enable the flag\n';
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

      setSession(textSession);
      setInitState('initialized');
    } catch (error) {
      console.error('Failed to initialize Gemini Nano:', error);
      setInitState('idle');
      alert(`Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Clean up status monitoring interval
      if (statusInterval) {
        window.clearInterval(statusInterval);
        statusInterval = null;
      }
    }
  }, []);

  const clearSession = useCallback(async () => {
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
      } catch (error) {
        console.error('Failed to clear session:', error);
        setSession(null);
        setInitState('idle');
      }
    }
  }, [session]);

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

          setSession(textSession);
          setInitState('initialized');
        } catch (error) {
          console.error('Failed to auto-initialize Gemini Nano:', error);
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

  return {
    initState,
    session,
    createSession,
    clearSession,
  };
}


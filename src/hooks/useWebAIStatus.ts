import { useState, useEffect } from 'react';
import { checkWebAIRequirements } from '../components/AskGemini/utils';
import type { WebAIStatus } from '../components/AskGemini/types';

export function useWebAIStatus() {
  const [webAIStatus, setWebAIStatus] = useState<WebAIStatus | null>(null);

  useEffect(() => {
    checkWebAIRequirements().then(setWebAIStatus);
  }, []);

  return webAIStatus;
}


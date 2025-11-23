import type { WebAIStatus } from './types';

export async function checkWebAIRequirements(): Promise<WebAIStatus> {
  // Check if running in Chrome
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  // Extract Chrome version
  const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
  const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : null;
  
  // Minimum Chrome version for Prompt API (138+)
  const minChromeVersion = 138;
  
  if (!isChrome) {
    return {
      isAvailable: false,
      isChrome: false,
      chromeVersion: null,
      message: 'Prompt API requires Google Chrome browser',
      instructions: [
        'Please use Google Chrome browser to access this feature',
        `Prompt API is available in Chrome ${minChromeVersion} or later`,
        'Download Chrome from: https://www.google.com/chrome/'
      ],
      availability: 'unavailable'
    };
  }
  
  if (chromeVersion && chromeVersion < minChromeVersion) {
    return {
      isAvailable: false,
      isChrome: true,
      chromeVersion,
      message: `Your Chrome version (${chromeVersion}) is too old`,
      instructions: [
        `Prompt API requires Chrome ${minChromeVersion} or later`,
        'Please update Chrome to the latest version',
        'Go to: chrome://settings/help to check for updates'
      ],
      availability: 'unavailable'
    };
  }
  
  // Check if LanguageModel API is available
  if (!window.LanguageModel) {
    return {
      isAvailable: false,
      isChrome: true,
      chromeVersion,
      message: 'Prompt API is not available',
      instructions: [
        'The Prompt API requires Chrome version 138 or newer',
        'The Prompt API may not be enabled in your Chrome version',
        'For localhost development, enable the following flag:',
        '1. Go to chrome://flags/',
        '2. Enable: #prompt-api-for-gemini-nano-multimodal-input',
        '3. Click Relaunch or restart Chrome',
        '',
        'Hardware requirements:',
        '- At least 4 GB of free storage space (model size: ~4 GB)',
        '- GPU: At least 3 GB VRAM (recommended for best quality), or',
        '- CPU: 16 GB RAM and 4+ CPU cores',
        '- Unmetered network connection (Wi-Fi or ethernet)'
      ],
      availability: 'unavailable'
    };
  }
  
  // Check availability
  try {
    const availability = await window.LanguageModel.availability();
    
    // 'available' is the same as 'readily' - model is ready to use
    if (availability === 'readily' || availability === 'available') {
      return {
        isAvailable: true,
        isChrome: true,
        chromeVersion,
        message: 'Prompt API is ready',
        instructions: [],
        availability: 'readily'
      };
    } else if (availability === 'downloadable') {
      return {
        isAvailable: false,
        isChrome: true,
        chromeVersion,
        message: 'Gemini Nano model can be downloaded',
        instructions: [
          'The Gemini Nano v3 model (~4 GB) can be downloaded',
          'Click "Download" to start the download',
          'The download may take several minutes depending on your internet connection',
          'You need at least 4 GB of free storage space',
          'The model will use GPU if available (3+ GB VRAM) for best performance'
        ],
        availability: 'downloadable'
      };
    } else if (availability === 'downloading') {
      return {
        isAvailable: false,
        isChrome: true,
        chromeVersion,
        message: 'Gemini Nano model is downloading',
        instructions: [
          'The Gemini Nano v3 model (~4 GB) is being downloaded',
          'This will happen automatically when you click "Download"',
          'The download may take several minutes depending on your internet connection',
          'Please wait - the download will complete automatically'
        ],
        availability: 'downloading'
      };
    } else {
      return {
        isAvailable: false,
        isChrome: true,
        chromeVersion,
        message: 'Prompt API is unavailable',
        instructions: [
          'The model may not be available due to:',
          '- Insufficient storage (need at least 4 GB free for model download)',
          '- Hardware requirements not met',
          '- Metered network connection',
          '',
          'Hardware requirements:',
          '- GPU: At least 3 GB VRAM (recommended for best quality), or',
          '- CPU: 16 GB RAM and 4+ CPU cores',
          '- Unmetered network connection (Wi-Fi or ethernet)',
          '',
          'Model information:',
          '- Model: Gemini Nano v3',
          '- Size: ~4 GB',
          '- Backend: GPU (if available) or CPU'
        ],
        availability: 'unavailable'
      };
    }
  } catch (error) {
    return {
      isAvailable: false,
      isChrome: true,
      chromeVersion,
      message: 'Error checking Prompt API availability',
      instructions: [
        'An error occurred while checking availability',
        'Make sure you are using Chrome 138 or later',
        'For localhost, enable the required flags in chrome://flags/'
      ],
      availability: 'unavailable'
    };
  }
}


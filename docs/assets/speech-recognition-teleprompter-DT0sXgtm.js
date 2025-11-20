const e=`---
date: 2025-10-21
---

# Speech Teleprompter using Web Speech API and Document PiP

## The Problem That Started It All

I wanted to record a video for my YouTube channel, but I had never done this before. I needed a teleprompter to help me deliver my content smoothly, but I couldn't find a suitable solution that met my needs. Most existing teleprompters were either too expensive, too complex, or didn't have the real-time speech recognition features I was looking for. So I decided to build my own.

What started as a simple need for a personal tool quickly evolved into a comprehensive web application that combines modern web technologies to create an intelligent teleprompter with real-time speech recognition and Picture-in-Picture support.

## The Solution: A Modern Web-Based Teleprompter

I built **Speech Teleprompter** - a Vue 3 application that leverages the Web Speech API for real-time speech recognition and the Document Picture-in-Picture API for floating window functionality. The application features an advanced fuzzy matching algorithm that compares spoken words with script text in real-time, automatically scrolling the teleprompter as you speak.

### Core Features

The application includes several key features that make it a powerful tool for content creators:

- **Real-time Speech Recognition**: Advanced speech-to-text with fuzzy matching algorithm
- **Picture-in-Picture Mode**: Move teleprompter to floating window while preserving state
- **Script Management**: Easy script editing with word count and progress tracking
- **Multi-language Support**: Speech recognition in multiple languages
- **Auto-scroll**: Automatically scrolls the text based on speech progress
- **Local Storage**: Automatic saving of settings and scripts

## The Technical Deep Dive

### Speech Recognition Implementation

The heart of the application is the speech recognition system built using the Web Speech API. Here's how it works:

\`\`\`typescript
const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const isRecognizing = ref(false);
  const finalTranscript = ref('');
  const primaryLanguage = ref('en-US');
  const recognition = ref<any | null>(null);

  // Language support for 25+ languages
  const languageNames: Record<string, string> = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'es-ES': 'Spanish (Spain)',
    'fr-FR': 'French (France)',
    'de-DE': 'German (Germany)',
    'ru-RU': 'Russian (Russia)',
    // ... and many more
  };

  const onRecognitionResult = (event: any): void => {
    let interimTranscript = '';
    let newFinalWords: string[] = [];

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript.value += transcript + ' ';
        newFinalWords = transcript
          .trim()
          .split(/\\s+/)
          .filter((word: string) => word.length > 0);
      } else {
        interimTranscript += transcript;
      }
    }

    // Process words for matching if we have new final words
    if (newFinalWords.length > 0) {
      debouncedProcessResult(newFinalWords, speechOutputHTML);
    }
  };
};
\`\`\`

The system processes speech in real-time, separating interim results (what you're currently saying) from final results (confirmed speech). This allows for immediate feedback while maintaining accuracy for the matching algorithm.

### The Fuzzy Matching Algorithm

The most challenging part was creating an algorithm that could accurately match spoken words with the script text. I implemented a sliding window algorithm with bonus scoring:

\`\`\`typescript
const findBestMatch = async (
  spokenWords: string[],
  scriptWords: string[],
  startIndex: number = 0
): Promise<MatchResult> => {
  // Determine search window size
  const bufferSize = Math.min(
    10,
    Math.max(5, Math.floor(spokenWords.length * 0.5))
  );
  const windowSize = spokenWords.length + bufferSize;
  const searchEnd = Math.min(startIndex + windowSize, scriptWords.length);

  let bestMatch: MatchResult = {
    index: -1,
    score: 0,
    length: spokenWords.length,
    rawSimilarity: 0,
    distance: 0,
  };

  // Sliding window comparison
  for (
    let i = startIndex;
    i <= Math.max(startIndex, searchEnd - spokenWords.length);
    i++
  ) {
    let score = 0;
    let matches = 0;

    // Compare each word in the spoken fragment
    for (let j = 0; j < spokenWords.length; j++) {
      const spokenWord = spokenWords[j].toLowerCase();
      const scriptWord = scriptWords[i + j]?.toLowerCase();

      if (spokenWord === scriptWord) {
        matches++;
        score += 1;

        // Bonus scoring based on position
        if (j === spokenWords.length - 1) {
          // Last word bonus: +3
          score += 3;
        } else if (j === spokenWords.length - 2) {
          // Second-to-last word bonus: +2
          score += 2;
        }
      }
    }

    // Calculate similarity as percentage of matches
    const similarity = matches / spokenWords.length;

    // Update best match if this is better
    if (score > bestMatch.score) {
      bestMatch = {
        index: i,
        score: score,
        length: spokenWords.length,
        rawSimilarity: similarity,
        distance: Math.abs(i - startIndex),
      };
    }
  }

  return bestMatch;
};
\`\`\`

The algorithm uses several key strategies:

1. **Sliding Window**: Instead of searching the entire script, it focuses on a window around the current position
2. **Bonus Scoring**: Gives higher scores to matches at the end of phrases, which are typically more reliable
3. **Context Accumulation**: Builds up context from multiple speech recognition results
4. **Performance Optimization**: Uses debouncing and async processing to prevent UI blocking

### Document Picture-in-Picture Integration

One of the most innovative features is the Picture-in-Picture mode using the Document Picture-in-Picture API. This allows users to move the teleprompter to a floating window while keeping all functionality intact:

\`\`\`typescript
const openPiP = async (): Promise<void> => {
  if (!isPiPSupported.value) {
    log.error('Document Picture-in-Picture not supported');
    return;
  }

  try {
    // Move the actual teleprompter section to PiP
    const teleprompterSection = moveTeleprompterToPiP();

    const pipContent = createPiPContent();
    const blob = new Blob([pipContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    pipWindow.value = await window.documentPictureInPicture.requestWindow({
      width: 400,
      height: 300,
    });

    // Set up the PiP window
    if (pipWindow.value) {
      pipWindow.value.document.write(pipContent);
      pipWindow.value.document.close();

      // Insert the actual teleprompter section into PiP window
      const pipContentContainer =
        pipWindow.value.document.getElementById('pip-content');
      if (pipContentContainer) {
        pipContentContainer.appendChild(teleprompterSection);
      }

      // Copy styles from main document
      const mainStyles = document.querySelectorAll(
        'style, link[rel="stylesheet"]'
      );
      mainStyles.forEach((style) => {
        if (style.tagName === 'STYLE') {
          const clonedStyle = style.cloneNode(true);
          pipWindow.value!.document.head.appendChild(clonedStyle);
        }
      });
    }

    // Update store and sync
    store.updatePiPState(true, pipWindow.value);
    syncPiPState(true, pipWindow.value);
  } catch (error) {
    log.error('Failed to open PiP window:', error);
  }
};
\`\`\`

The PiP implementation includes:

- **State Synchronization**: Uses BroadcastChannel API to keep the main window and PiP window in sync
- **Style Inheritance**: Copies all styles from the main document to maintain visual consistency
- **Event Handling**: Preserves all functionality including speech recognition and scrolling
- **Window Management**: Handles window lifecycle events and cleanup

## The Architecture

The application is built with a modern, modular architecture:

- **Vue 3 + TypeScript**: For type-safe, reactive components
- **Pinia**: For centralized state management
- **Composables**: For reusable logic (speech recognition, fuzzy matching, PiP)
- **Vite**: For fast development and building
- **Vitest**: For comprehensive testing

The state management is handled through a centralized store that tracks:

- Script text and current position
- Speech recognition status
- PiP window state
- User settings and preferences
- Scroll position and progress

## Browser Support and Limitations

The application works best in modern browsers with full support for:

- **Chrome/Chromium**: Full support for all features
- **Microsoft Edge**: Full support for all features
- **Safari**: Limited support (no Picture-in-Picture)
- **Firefox**: Limited support (no Picture-in-Picture)

The Web Speech API has varying levels of support across browsers, with Chrome providing the most reliable experience.

## Performance Optimizations

Several optimizations were implemented to ensure smooth performance:

1. **Debounced Processing**: Speech results are processed in batches to prevent UI blocking
2. **Sliding Window Algorithm**: Reduces search space for fuzzy matching
3. **Context Window Management**: Limits the amount of context kept in memory
4. **Async Processing**: Uses requestIdleCallback for non-blocking operations
5. **State Synchronization**: Efficient updates between main window and PiP

## The Development Journey

Building this application taught me several valuable lessons:

1. **Web APIs are Powerful**: The Web Speech API and Document Picture-in-Picture API provide capabilities that were previously only available in native applications.

2. **Fuzzy Matching is Complex**: Creating an accurate matching algorithm requires careful consideration of edge cases, performance, and user experience.

3. **State Management is Critical**: With multiple windows and real-time updates, proper state management becomes essential for maintaining consistency.

4. **Browser Compatibility Matters**: Different browsers have different levels of support for cutting-edge APIs, requiring graceful degradation.

## Future Plans and Open Source

The web version of Speech Teleprompter will remain **completely free** for all users. I believe that tools like this should be accessible to everyone, especially content creators who are just starting out.

I'm actively working on improvements and new features, and I welcome contributions from the community. If you have ideas for new features, bug reports, or want to contribute code, please feel free to:

- **Open an issue** on GitHub with your suggestions
- **Submit a pull request** with your improvements
- **Share feedback** about your experience using the application

The project is open source and available under the MIT License, so you're free to use it, modify it, and even build your own version.

## Conclusion

What started as a simple need for a personal teleprompter has become a comprehensive web application that demonstrates the power of modern web technologies. By combining the Web Speech API with advanced fuzzy matching algorithms and the Document Picture-in-Picture API, I've created a tool that not only solves my original problem but also provides a foundation for future enhancements.

The journey from "I need a teleprompter" to "I built a teleprompter" has been incredibly rewarding, and I'm excited to see how the community will help shape its future development.

## Try It Yourself

- **Live Demo**: [https://andrey-roshchupkin.github.io/speech-teleprompter/](https://andrey-roshchupkin.github.io/speech-teleprompter/)
- **Source Code**: [https://github.com/Andrey-Roshchupkin/speech-teleprompter](https://github.com/Andrey-Roshchupkin/speech-teleprompter)
- **Issues & Feedback**: [https://github.com/Andrey-Roshchupkin/speech-teleprompter/issues](https://github.com/Andrey-Roshchupkin/speech-teleprompter/issues)
`;export{e as default};

const e=`---
date: 2025-09-18
---

# Speech Teleprompter

A modern web-based teleprompter application with real-time speech recognition and Picture-in-Picture support.

## Overview

Speech Teleprompter is a Vue 3 application that leverages the Web Speech API for real-time speech recognition and the Document Picture-in-Picture API for floating window functionality. The application features an advanced fuzzy matching algorithm that compares spoken words with script text in real-time, automatically scrolling the teleprompter as you speak.

## Features

- **Real-time Speech Recognition**: Advanced speech-to-text with fuzzy matching algorithm
- **Picture-in-Picture Mode**: Move teleprompter to floating window while preserving state
- **Script Management**: Easy script editing with word count and progress tracking
- **Multi-language Support**: Speech recognition in multiple languages
- **Auto-scroll**: Automatically scrolls the text based on speech progress
- **Local Storage**: Automatic saving of settings and scripts
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- Vue 3 + TypeScript
- Pinia (state management)
- Vite
- Web Speech API
- Document Picture-in-Picture API
- Google Analytics 4
- Vitest (testing)

## Key Technical Details

- **Fuzzy Matching Algorithm**: Implements a sliding window algorithm to match spoken words with script text
- **State Synchronization**: Uses BroadcastChannel API to keep main window and PiP window in sync
- **Performance Optimizations**: Debounced processing, sliding window algorithm, async processing
- **Browser Support**: Full support in Chrome/Edge, limited in Safari/Firefox

## Links

- **Live Demo**: [https://andrey-roshchupkin.github.io/speech-teleprompter/](https://andrey-roshchupkin.github.io/speech-teleprompter/)
- **GitHub**: [https://github.com/Andrey-Roshchupkin/speech-teleprompter](https://github.com/Andrey-Roshchupkin/speech-teleprompter)

`;export{e as default};

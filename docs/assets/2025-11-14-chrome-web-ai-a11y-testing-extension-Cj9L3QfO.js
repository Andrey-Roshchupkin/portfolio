const e=`---
date: 2025-11-14
---

# Chrome WebAI Accessibility Testing Extension

A Chrome extension for accessibility testing using Chrome's built-in WebAI and Gemini model.

## Overview

This Chrome extension leverages Chrome's WebAI API to provide access to Gemini, a multimodal AI model that can analyze text, images, and web page structures directly in the browser. The tool combines visual and DOM analysis to detect accessibility issues and generate actionable recommendations.

## Features

- **AI-Powered Analysis**: Uses Gemini model for accessibility testing
- **Visual Analysis**: Analyzes page visuals for accessibility issues
- **DOM Analysis**: Examines HTML structure for semantic issues
- **Actionable Recommendations**: Generates specific improvement suggestions
- **Local Processing**: Runs entirely in Chrome using Gemini Nano
- **Color Contrast Detection**: Identifies color contrast problems
- **Labeling Corrections**: Suggests improvements for form labels and ARIA attributes

## Technology Stack

- Chrome Extension API
- Chrome WebAI API
- Gemini Nano model
- JavaScript/TypeScript

## Use Cases

- QA engineers testing web accessibility
- Developers checking their own work
- Automated accessibility audits
- Educational tool for learning accessibility best practices

## Workshop Material

This extension was created as a workshop material for the DevFest Armenia 2025 session "WebAI in Action: AI-Powered Accessibility Testing in Chrome".

## Links

- **GitHub**: [https://github.com/Andrey-Roshchupkin/chrome-web-ai-a11y-testing-extension](https://github.com/Andrey-Roshchupkin/chrome-web-ai-a11y-testing-extension)
- **Related Session**: [DevFest Armenia 2025 - WebAI in Action](https://devfest.am/2025)

`;export{e as default};

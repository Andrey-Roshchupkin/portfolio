const e=`---
date: 2025-11-20
---

# Portfolio Website

A modern, minimalist portfolio website built with React, TypeScript, and Tailwind CSS.

## Overview

This portfolio website features a clean, GitHub-inspired design with dark mode support. It includes multiple content sections that automatically read Markdown files and generate listings: articles, projects, public speeches, along with dedicated pages for "About Me" and a downloadable resume.

## Features

### Content Sections
- **My Articles** - Blog system that automatically reads Markdown files from \`materials/posts/\` and generates article listings sorted by date
- **My Projects** - Showcase of open-source projects with descriptions from \`materials/projects/\`
- **Public Speeches** - List of conference talks and presentations from \`materials/speeches/\`
- **About Me** - Personal introduction page rendered from \`materials/about/about.md\`
- **Resume** - Professional resume with:
  - Markdown rendering from \`materials/resume/\`
  - PDF download (generated at build time using \`md-to-pdf\`)
  - Copy to clipboard functionality
  - Visual feedback for user actions

### UI/UX Features
- **Theme System** - Dark/Light/System theme toggle with localStorage persistence
- **GitHub-style Design** - Clean, minimalist design inspired by GitHub's color scheme and typography
- **SPA Routing** - Direct links to all content with React Router and GitHub Pages 404.html fallback
- **Loading States** - Smooth loading indicators while content is being fetched
- **Responsive Design** - Optimized for all screen sizes
- **Sticky Navigation** - Header and back buttons remain visible while scrolling

### Technical Features
- **Fast Build** - Optimized with Vite for minimal bundle size and fast load times
- **Type Safety** - Full TypeScript coverage
- **Component Architecture** - Reusable components (ItemList, ContentView) to reduce duplication
- **Markdown Processing** - Centralized utility functions for parsing and metadata extraction
- **Automatic PDF Generation** - Resume PDF generated during build process

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering
- **Gray Matter** - Frontmatter parsing
- **md-to-pdf** - PDF generation from Markdown (build-time)
- **Lucide React** - Icon library
- **@tailwindcss/typography** - Beautiful typography for Markdown content

## Project Structure

\`\`\`
portfolio/
├── materials/          # All content (Markdown files)
│   ├── posts/         # Blog articles
│   ├── projects/      # Project descriptions
│   ├── speeches/     # Conference talks
│   ├── about/        # About me content
│   └── resume/       # Resume markdown and PDF
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks (useTheme)
│   ├── utils/        # Utility functions (markdown processing)
│   └── config.ts     # Site configuration
├── scripts/          # Build scripts (PDF generation)
└── docs/             # Build output (GitHub Pages)
\`\`\`

## Deployment

Deployed on GitHub Pages with:
- Manual deployment by building to \`docs/\` folder
- Automatic SPA routing support via \`404.html\` fallback
- PDF generation during build process
- Base path configuration for repository name

## Links

- **Live Site**: [https://andrey-roshchupkin.github.io/portfolio](https://andrey-roshchupkin.github.io/portfolio)
- **GitHub**: [https://github.com/Andrey-Roshchupkin/portfolio](https://github.com/Andrey-Roshchupkin/portfolio)

`;export{e as default};

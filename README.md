# Portfolio Website

Personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 📝 **My Articles** - Blog with Markdown support, automatically reads and displays articles
- 💼 **My Projects** - Showcase of open-source projects with descriptions
- 🎤 **Public Speeches** - List of conference talks and presentations
- 👤 **About Me** - Personal introduction and background
- 📄 **Resume** - Professional resume with PDF download and copy functionality
- 🤖 **Ask Gemini** - Interactive AI chat powered by Chrome's WebAI API and Gemini Nano:
  - Multimodal input (text and images)
  - HR Mode for job vacancy evaluation against candidate profile
  - Works locally without internet after model download
  - Chat history persistence with localStorage
  - Copy conversation to clipboard
- 🌓 **Theme Toggle** - Dark/Light/System theme with localStorage persistence
- 🎨 **GitHub-style Design** - Clean, minimalist design inspired by GitHub
- 🔗 **SPA Routing** - Direct links to all content with React Router
- 📱 **Responsive Design** - Optimized for all screen sizes
- ⚡ **Fast & Optimized** - Built with Vite for optimal performance
- 🔄 **Loading States** - Smooth loading indicators for content

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Ask Gemini Setup

The "Ask Gemini" feature uses Chrome's WebAI API with Gemini Nano model. To enable it:

1. **Chrome Requirements:**
   - Chrome 127+ (or Chromium-based browser)
   - Windows 11+ or macOS 14.1+ or Linux (with Chrome 127+)

2. **Enable Chrome Flags:**
   - Open `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` in Chrome
   - Set the flag to **Enabled**
   - Restart Chrome

3. **First Time Setup:**
   - Navigate to the "Ask Gemini" page
   - Click "Download" to download the Gemini Nano model (~2GB)
   - Download time depends on your internet speed:
     - 50 Mbit/s: ~40 minutes
     - 100 Mbit/s: ~20 minutes
     - 200 Mbit/s: ~10 minutes
   - Once downloaded, the model works offline

4. **HR Mode:**
   - Enabled by default
   - Evaluates job descriptions against candidate profile
   - Provides match assessment with risks and recommendations
   - Can be toggled on/off at any time

## Deployment to GitHub Pages

The project uses manual deployment by copying built files to the `docs` folder.

### Setup Instructions

1. **Configure base path** (one-time setup):
   - Edit `vite.config.ts`
   - If your repository is `username.github.io`, set `base: '/'`
   - For other repos, set `base: '/repository-name/'` (replace with your repo name)

2. **Build and deploy:**
   ```bash
   npm run deploy
   ```
   
   Or manually:
   ```bash
   npm run build
   git add docs
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository **Settings → Pages**
   - Under "Build and deployment", select **Source: Deploy from a branch**
   - Select **Branch: `main`**
   - Select **Folder: `/docs`**
   - Click **Save**

4. **Your site will be available at:**
   - `https://username.github.io` (if repo is `username.github.io`)
   - `https://username.github.io/repository-name` (for other repos)

### Important Notes

- The build output goes directly to the `docs` folder
- The `docs` folder is committed to the repository
- After each change, run `npm run deploy` to rebuild and push updates
- GitHub Pages will automatically deploy when you push to the `main` branch

## Configuration

Edit `src/config.ts` to customize:
- Your name and title
- LinkedIn and GitHub links

## Content Structure

All content is stored in the `materials/` folder at the project root:

```
materials/
├── posts/          # Blog articles
├── projects/       # Project descriptions
├── speeches/      # Conference talks and presentations
├── about/         # About me page content
└── resume/        # Resume markdown and PDF
```

### Adding Content

#### Blog Posts
1. Create a new `.md` file in `materials/posts/`
2. Optionally prefix filename with date: `YYYY-MM-DD-title.md`
3. Add frontmatter with date (optional):
   ```markdown
   ---
   date: 2024-01-15
   ---
   
   # Your Article Title
   ```
4. The title will be extracted from the first `#` heading if not in frontmatter
5. Posts are automatically sorted by date (newest first)

#### Projects
1. Create a new `.md` file in `materials/projects/`
2. Follow the same naming and frontmatter conventions as posts
3. Projects are automatically listed and sortable by date

#### Public Speeches
1. Create a new `.md` file in `materials/speeches/`
2. Follow the same naming and frontmatter conventions as posts
3. Speeches are automatically listed and sortable by date

#### About Me
1. Edit `materials/about/about.md`
2. The content is rendered directly on the About page

#### Resume
1. Edit `materials/resume/SDET-AQA-Andrey-Roshchupkin.md`
2. PDF is automatically generated during build using `md-to-pdf`
3. The PDF is available for download on the Resume page

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering with GitHub-style styling
- **Lucide React** - Icon library
- **Gray Matter** - Frontmatter parsing
- **md-to-pdf** - PDF generation from Markdown (build-time)
- **@tailwindcss/typography** - Beautiful typography for Markdown content
- **Chrome WebAI API** - On-device AI inference with Gemini Nano

## License

MIT

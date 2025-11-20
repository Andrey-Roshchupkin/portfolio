# Portfolio Website

Personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 📝 Blog with Markdown support
- 🌓 Dark/Light/System theme toggle
- 🎨 GitHub-style design
- 🔗 Direct links to articles (routing)
- 📱 Responsive design
- ⚡ Fast and optimized

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

## Adding Blog Posts

1. Create a new `.md` file in `src/posts/`
2. Add frontmatter with date (optional):
   ```markdown
   ---
   date: 2024-01-15
   ---
   
   # Your Article Title
   ```
3. The title will be extracted from the first `#` heading if not in frontmatter
4. Posts are automatically sorted by date (newest first)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Routing
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

## License

MIT

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

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Source", select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main` branch

3. **Repository naming:**
   - If your repository is named `username.github.io`, the site will be available at `https://username.github.io`
   - For other repository names, the site will be at `https://username.github.io/repository-name`
   - The workflow automatically configures the base path

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

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

# White Toyota Corolla Connections

Connection based game gift!

## Getting Started

### Installation

Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Deployment

This project is configured for Vercel deployment. The `vercel.json` file includes the necessary configuration for:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing support (all routes redirect to index.html)

To deploy:
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Vercel will automatically detect the Vite framework and use the configuration

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Project Structure

```
├── src/
│   ├── App.jsx       # Main App component
│   ├── App.css       # App styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
├── vercel.json       # Vercel deployment configuration
└── package.json      # Dependencies and scripts
```

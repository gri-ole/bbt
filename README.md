# BusyBuddy.Toys - Under Construction Landing Page

A modern, responsive landing page for BusyBuddy.Toys with animated progress bar, day/night theme toggle, and glassmorphism design.

## Features

- 🎨 **Glassmorphism Design** - Modern glass-effect card with backdrop blur
- 🌓 **Day/Night Theme Toggle** - Smooth transitions between light and dark modes
- 📊 **Animated Progress Bar** - Date-based construction progress calculation
- 🎬 **Video Background** - Blurred video background with overlay
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **No Build Step** - Uses CDN libraries and Babel in-browser compilation

## Tech Stack

- React 18 (via CDN)
- Babel Standalone (for JSX transformation)
- Pure CSS with modern features (backdrop-filter, CSS Grid, Flexbox)
- Geologica font family

## Local Development

```bash
npm install
npm run dev
```

Server will start on `http://localhost:3000`

## Deployment

This project is configured for Vercel deployment. Simply:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect and deploy

Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
webpage/
├── index.html          # Main HTML file
├── src/
│   ├── App.jsx        # Main React component
│   ├── main.jsx       # React entry point
│   ├── styles.css     # Global styles
│   └── ThreeScene.jsx # Three.js scene (optional)
├── media/             # Static assets (logos, videos)
├── vercel.json        # Vercel configuration
└── package.json       # Project metadata
```

## Configuration

- **Background Video**: Place your `.webm` file in `/media/busybuddy-bg.webm`
- **Theme**: Toggle between day/night mode using the switch in the card header
- **Progress Dates**: Edit `START_DATE` and `END_DATE` in `src/App.jsx`

## License

ISC


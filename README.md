# Anime Dashboard Extension

A lightweight, customizable browser extension that transforms your new-tab page into an elegant anime-themed dashboard. Built with React, Vite, and Bootstrap.

---

## Overview

Anime Dashboard Extension automatically loads full-screen wallpapers from a GitHub repository and displays them in a carousel with adjustable timing. Users can open a sidebar to modify settings, manage intervals, and explore available image folders. The project emphasizes simplicity, performance, and visual appeal.

---

## Features

- Loads anime wallpapers directly from GitHub.
- Carousel mode with adjustable display intervals.
- Off-canvas sidebar for settings and folder navigation.
- Built with React and Vite for fast startup.
- Uses React-Bootstrap for consistent, responsive styling.
- Caches fetched images in local storage for performance.

---

## Getting Started

### Clone and Install

```bash
git clone https://github.com/luantran/anime-dashboard-extension.git
cd anime-dashboard-extension
npm install
```

### Development Server

```bash
npm run dev
```
This runs the Vite development server. Open the local URL shown in your terminal (e.g., http://localhost:5173) to preview the app.

### Development Server

```bash
npm run build
```

The production build will be generated in the dist folder.

### Load as a Browser Extension

1. Open chrome://extensions (or the equivalent page in Edge or another Chromium-based browser).
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the dist folder from this project.
5. Open a new tab to view your anime dashboard.

## License

This project is licensed under the MIT License.
You may use, modify, and distribute this project with attribution.

## Author

Developed and maintained by Luan Tran
.
Wallpapers and image data are sourced from the public repository luantran/anime-wallpapers.
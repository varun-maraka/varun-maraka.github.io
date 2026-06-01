# React Menu App with GitHub Pages

A React application with React Router that works seamlessly on GitHub Pages. Each menu item loads its own dedicated page without refreshing the entire site.

## Features

✅ **4 Menu Items** - Home, About, Contact, Breathing Techniques  
✅ **Separate Pages** - Each menu item has its own dedicated content  
✅ **Hash-based routing** - Navigation via `window.location.hash` (no React Router)  
✅ **GitHub Pages Compatible** - Works perfectly on GitHub Pages  
✅ **Hamburger Menu** - Responsive mobile-friendly navigation  
✅ **Modern Styling** - Clean and professional design  
✅ **Form Handling** - Contact form with validation  
✅ **Breathing Techniques** - Guided breathing timer with audio cues and favorites  

## Tech Stack

- **React** 18.2.0
- **Redux** - Hamburger menu state only (`isMenuOpen`)
- **Web Audio API** - Background-safe audio for breathing techniques
- **react-scripts** 5.0.1
- **gh-pages** - For GitHub Pages deployment

## Project Structure

```
src/
├── components/
│   ├── Navigation.js           # Navigation menu component
│   └── Navigation.css          # Navigation styling
├── hooks/
│   └── useVisitorTracking.js   # Visitor tracking (fires once/device/day)
├── pages/
│   ├── Home.js                 # Home page
│   ├── About.js                # About page
│   ├── Contact.js              # Contact page
│   ├── BreathingTechniques.js  # Breathing timer with Web Audio API
│   └── Pages.css               # Pages styling
├── redux/
│   └── ...                     # Hamburger menu state (isMenuOpen)
├── App.js                      # Main app component; hash-based routing
├── App.css                     # App styling
├── index.js                    # React entry point
└── index.css                   # Global styles

public/
├── techniques/                 # Audio (inhale.mp3, hold.mp3, exhale.mp3) + images
└── index.html                  # HTML template

package.json                # Dependencies and scripts
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/varun-maraka/varun-maraka.github.io.git
cd varun-maraka.github.io
```

2. **Install dependencies:**
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

### Production Build

Build for production:
```bash
npm build
```

Creates an optimized build in the `build/` folder.

## Deployment to GitHub Pages

### Automatic Deploy (Recommended)

```bash
npm run deploy
```

This will:
1. Build the app for production
2. Deploy to GitHub Pages automatically
3. Your site will be live at `https://varun-maraka.github.io/`

### Manual Deploy

1. Build the app:
```bash
npm run build
```

2. Push build folder to GitHub: 
    Code can be pushed to any branch.
    But Build folder and index.html and other folder should be pushed to gh-pages branch  or any branch that is linked to git hub pages.
    If we do Auto Deploy using command it will created a commit in that branch.
```bash
git add build
git commit -m "Deploy build"
git push origin main
```

3. Configure GitHub Pages:
   - Go to Settings of the Repository → Pages
   - Set source to `gh-pages` branch

### Deploy issue
On Feb 16, 2026  there was an issue in deployment
I was deploying to gh-newMenu, but the code was getting built from gh-pages.
Later I understood that code can be built and deployed without commit using above commands.

Now I changed package.json deploy script to push to gh-newMenu branch, we can change it to what ever branch we want to push.

* If auto deployment does not work do a manual deployment using command line.
* Currently behaviour is overrideing the the pages branch that was set in Settings of GitHub.

###Deployment Architecture:

gh-newMenu branch - Your source code (React components, CSS, JavaScript)
gh-pages branch - The built/production code that GitHub Pages serves
The Process:

You write code on gh-newMenu branch
When you run npm run deploy, it:
Builds the React app → creates build folder
Takes contents of build folder → pushes to gh-pages branch
GitHub Pages reads from gh-pages branch and serves it to https://varun-maraka.github.io/

### Deploy questions
Q: From where the website is rendered, from index.html in main folder or index.html in build folder?
Ans:  It is rendered from the build folder, but it will be deployed to gh-pages branch after command is executed.
  So from build folder it goes to gh-pages branch where there is not build folder, it sits there directly on main folder.

Q2: There is a index.html in main folder of this branch what is the use of it?
Ans: It is created earlier and it will not be used in rendering the website.
    After react components are build  all the react code goes into index.html, after deployment this index.html goes to gh-pages branch main folder.
## Pages Overview

### Home Page
- Welcome message
- Sample buttons with different colors
- Call-to-action content

### About Page
- Information about the application
- List of features
- Company mission

### Breathing Techniques Page
- 10 guided breathing techniques (Box, 4-7-8, 5-5, 7-11, etc.)
- Animated phase timer with voice cues (inhale / hold / exhale MP3s)
- Audio built on the **Web Audio API** (`AudioContext`) — not HTML Audio elements — for better background behaviour
- Sound preference remembered across sessions (`localStorage`)
- Favorites system — heart icon on each tile, persisted in `localStorage`

**Platform audio behaviour:**

| Platform | Audio when screen locked |
|---|---|
| Android (Chrome) | ✅ Works |
| Desktop (Chrome / Firefox / Safari) | ✅ Works (screen doesn't lock) |
| iOS / iPadOS (Safari) | ❌ Does not work (see below) |

**Android / Desktop:** uses a silent looping buffer (keepalive) + Media Session API so the OS keeps the audio session alive. Phase cues play via `playAudioBuffer()` triggered on each phase change.

**iOS / iPadOS:** uses a different strategy — all audio cues for up to 40 cycles are pre-scheduled at absolute `AudioContext` timestamps when the session starts. These are handled by audio hardware, not JavaScript, so they should fire even when JS is suspended. A near-inaudible oscillator (0.001 gain) keeps the `AudioContext` registered as an active audio session.

**Known limitation — iOS screen lock:**
Audio cues stop when the iPhone/iPad screen locks. This is a fundamental iOS Safari restriction — web apps cannot maintain an audio session across screen lock the way native apps can (native apps use Apple's `AVAudioSession` API, which is not accessible from the browser). The following approaches were tried and none worked reliably: HTML Audio, Web Audio API pre-scheduling, silent-buffer keepalive, oscillator keepalive, Media Session API. This issue is not being pursued further.

### Contact Page
- Contact form with validation
- Name, email, and message fields
- Form submission handling

## Menu Items

The navigation bar contains 4 menu items:
1. **Home** - Welcome page with introduction
2. **About** - Information about the project
3. **Services** - Services offered
4. **Contact** - Contact form

## Styling Features

- **Color-coded buttons:**
  - Primary (Blue) - `.btn-primary`
  - Success (Green) - `.btn-success`
  - Danger (Red) - `.btn-danger`
  - Warning (Orange) - `.btn-warning`

- **Responsive design** - Mobile and desktop optimized
- **Smooth animations** - Page transitions and hover effects
- **Hamburger menu** - Mobile navigation

## Browser Support

- Chrome (latest) — full support including background audio
- Firefox (latest) — full support including background audio
- Safari on macOS (latest) — full support
- Edge (latest) — full support
- Safari on iOS / iPadOS — supported, but audio stops when screen locks (platform limitation)

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Deploy to GitHub Pages
npm run deploy
```

## Troubleshooting

### Port 3000 already in use
React will automatically prompt to use a different port.

### Blank page on GitHub Pages
- Ensure `"homepage"` in package.json matches your GitHub Pages URL
- Clear browser cache and rebuild

### Routing not working
- Make sure React Router is properly configured
- Check that all imports are correct

### Build errors
Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## What to Do Next

1. **Test locally:**
```bash
npm start
```

2. **Build:**
```bash
npm build
```

3. **Deploy:**
```bash
npm run deploy
```

Your site will be live at: `https://varun-maraka.github.io/`

## Visitor Tracking

The app tracks visitor activity and logs it to a Google Sheet via a Google Apps Script Web App.

### How it works

The custom hook `src/hooks/useVisitorTracking.js` fires once on app load. It:

1. Generates a persistent **device ID** stored in `localStorage` (`_did`) to identify the device across sessions
2. Checks if a tracking call was already made **today** (`localStorage` key `_tdate`) — skips if yes
3. Fetches the visitor's **IP address** via ipify.org
4. Fetches **geo details** (country, city) via ipapi.co
5. Parses **browser, OS, and device type** from `navigator.userAgent`
6. POSTs the payload to the Google Apps Script endpoint

### Google Sheet structure

**Logs tab** — one row per unique device (first visit only):

| Timestamp | IP | Country | City | Browser | OS | Device | Page URL | Device ID |

**DeviceStats tab** — one row per device, updated on each new day:

| Device ID | IP | Total Days | First Visit | Last Visit |

### Rules enforced

- **One entry per device** in the Logs tab (deduplicated by device ID)
- **One API call per device per day** — enforced client-side via `localStorage`
- **New entries appear at the top** of both sheets

### Notes

- A module-level flag `_trackingCalled` prevents React StrictMode's double-invocation in development from creating duplicate entries
- The POST uses `mode: 'no-cors'` since Apps Script does not return CORS headers; data is still received and logged correctly
- To update the Apps Script endpoint, change `APPS_SCRIPT_URL` in `src/hooks/useVisitorTracking.js`
- When redeploying Apps Script changes, use **Manage deployments → Edit → New version** to keep the same URL

---

## License

ISC

## Author

Varun Maraka

---

**Last Updated:** May 31, 2026

# React Redux Menu App

A modern web application built with **React** and **Redux**, featuring a fully functional hamburger menu and multiple pages.

## Features

✅ **Responsive Hamburger Menu** - Mobile-friendly navigation that toggles on smaller screens  
✅ **Redux State Management** - Centralized state with Redux for menu and page navigation  
✅ **Multi-Page Navigation** - Home, About, Services, and Contact pages  
✅ **Stylized Components** - Modern CSS with hover effects and animations  
✅ **Color-Coded Buttons** - Primary, Success, Danger, and Warning button styles  
✅ **Redux Logger** - Console logging of all Redux actions for debugging  
✅ **React 18** - Built with the latest React version  

## Tech Stack

- **Frontend Framework:** React 18.3.1
- **State Management:** Redux 4.2.1
- **React-Redux Integration:** 8.1.3
- **Logging:** Redux Logger 3.0.6
- **Build Tool:** Create React App (react-scripts 5.0.1)
- **Styling:** Custom CSS with responsive design

## Project Structure

```
src/
├── components/
│   ├── Menu.js              # Hamburger menu component
│   ├── Menu.css             # Menu styling
│   ├── Pages.js             # Page components (Home, About, Services, Contact)
│   └── Pages.css            # Pages styling
├── redux/
│   ├── actions.js           # Redux action creators
│   ├── reducer.js           # Redux reducer
│   └── store.js             # Redux store configuration
├── App.js                   # Main app component
├── App.css                  # App styling
├── index.js                 # React app entry point
└── index.css                # Global styles

public/
└── index.html               # HTML template

package.json                 # Project dependencies and scripts
README.md                    # This file
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
npm install --legacy-peer-deps
```

**Note:** `--legacy-peer-deps` is used because `react-border-wrapper` (v1.0.3) was built for React 15-16 but works fine with React 18.

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

This creates an optimized production build in the `build/` folder.

## Usage

### Navigation
- Click the **hamburger menu icon** (☰) on mobile/tablet to toggle the menu
- Click **menu items** to navigate between pages
- Active page is highlighted in blue

### Redux State
The app manages the following Redux states:
- **`isMenuOpen`** - Whether the hamburger menu is open
- **`activePage`** - Currently active page (home, about, services, contact)

All Redux actions are logged to the browser console (F12) via Redux Logger.

### Available Buttons
Four color-coded button styles are available:
- `.btn-primary` - Blue button
- `.btn-success` - Green button
- `.btn-danger` - Red button
- `.btn-warning` - Orange button

## Components

### Menu Component
- Responsive hamburger menu for mobile
- Redux-connected for state management
- Animated hamburger icon
- Active link highlighting

**File:** [src/components/Menu.js](src/components/Menu.js)

### Pages Component
- Home page with welcome message and sample buttons
- About page with project information
- Services page with service cards
- Contact page with contact form

**File:** [src/components/Pages.js](src/components/Pages.js)

### App Component
- Main app wrapper
- Page routing based on Redux state
- Footer component

**File:** [src/App.js](src/App.js)

## Redux Architecture

### Actions
Located in [src/redux/actions.js](src/redux/actions.js):
- `TOGGLE_MENU` - Toggles hamburger menu open/closed
- `SET_ACTIVE_PAGE` - Sets the active page and closes menu

### Reducer
Located in [src/redux/reducer.js](src/redux/reducer.js):
- Handles menu toggle state
- Handles page navigation state
- Automatically closes menu when a page is selected

### Store
Located in [src/redux/store.js](src/redux/store.js):
- Configures Redux store with Redux Logger middleware
- Logs all actions to browser console

## Dependencies

### Main Dependencies
- **react** ^18.2.0
- **react-dom** ^18.2.0
- **redux** ^4.2.1
- **react-redux** ^8.1.3
- **redux-logger** ^3.0.6
- **react-border-wrapper** ^1.0.3 (used in old containers)
- **react-scripts** 5.0.1

### Dev Dependencies
- **react-scripts** 5.0.1

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run custom dev server (if configured)
npm run dev
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

- **Mobile (<768px):** Hamburger menu visible, vertical navigation
- **Tablet/Desktop (≥768px):** Full horizontal menu bar

## Troubleshooting

### Port 3000 already in use
If port 3000 is in use, React will prompt to use a different port.

### Dependencies installation fails
If you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

### Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
```

## Future Enhancements

- [ ] Add routing with React Router
- [ ] Implement API integration
- [ ] Add user authentication
- [ ] Enhance accessibility (a11y)
- [ ] Add unit tests
- [ ] Update react-border-wrapper or find alternative

## License

ISC

## Author

Varun Maraka

---

**Last Updated:** February 16, 2026

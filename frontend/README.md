# Frontend Documentation

React + Vite + Pixi.js frontend for The Human Monument.

## 🏗️ Architecture

```
src/
├── components/       # React components
│   ├── Menu.jsx
│   ├── InfiniteWall.jsx
│   ├── ContributeCanvas.jsx
│   ├── FindSpot.jsx
│   ├── TileModal.jsx
│   └── LoadingSpinner.jsx
├── hooks/           # Custom React hooks
│   ├── useContributions.js
│   └── useAudioRecorder.js
├── lib/             # Utilities and helpers
│   ├── api.js
│   ├── pixiRenderer.js
│   └── tilePositioning.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

Application runs at `http://localhost:5173`

## 🎨 Components

### Menu.jsx
Main landing page with navigation options.

**Features:**
- Hero section with animated title
- Statistics display
- Navigation cards
- Responsive layout

```jsx
<Menu onNavigate={(view) => { /* handle navigation */ }} />
```

---

### InfiniteWall.jsx
Pixi.js-powered infinite canvas for viewing contributions.

**Features:**
- Pan and zoom with mouse/touch
- Smooth animations
- Click tiles to view details
- Auto-focus on target tiles

**Props:**
```jsx
<InfiniteWall 
  onBack={() => {}}           // Back button handler
  targetTile={contribution}   // Tile to focus on (optional)
  onTargetReached={() => {}}  // Called when target is reached
/>
```

**Controls:**
- 🖱️ Click + Drag: Pan
- 🔍 Scroll: Zoom
- 👆 Click Tile: View details

---

### ContributeCanvas.jsx
Multi-step form for creating contributions.

**Features:**
- Type selection (Text, Drawing, Image, Audio)
- Drawing canvas with tools
- Image upload with preview
- Audio recording (max 60s)
- Form validation
- Success modal with unique ID

```jsx
<ContributeCanvas onBack={() => {}} />
```

**Contribution Types:**
- **Text**: Rich textarea with character limit
- **Drawing**: HTML5 canvas with brush tools
- **Image**: File upload with size validation
- **Audio**: Browser MediaRecorder API

---

### FindSpot.jsx
Search interface for locating contributions.

**Features:**
- ID input with auto-formatting
- Error handling
- Loading states
- Tips for users

```jsx
<FindSpot 
  onBack={() => {}}
  onFound={(contribution) => { /* navigate to wall */ }}
/>
```

---

### TileModal.jsx
Modal for viewing contribution details.

**Features:**
- Content display for all types
- Audio playback controls
- Metadata display
- Backdrop click to close

```jsx
<TileModal 
  contribution={data}
  onClose={() => {}}
/>
```

---

### LoadingSpinner.jsx
Reusable loading indicator.

```jsx
<LoadingSpinner message="Loading..." />
```

---

## 🪝 Custom Hooks

### useContributions

Manages contributions state and API calls.

```javascript
const {
  contributions,      // Array of contributions
  loading,           // Loading state
  error,            // Error message
  stats,            // Statistics
  fetchContributions, // Fetch function
  findContribution,  // Find by ID
  addContribution,  // Add to local state
  refetch          // Re-fetch data
} = useContributions();
```

---

### useAudioRecorder

Handles audio recording functionality.

```javascript
const {
  isRecording,      // Recording state
  recordingTime,    // Time in seconds
  audioBlob,        // Recorded audio blob
  error,            // Error message
  startRecording,   // Start recording
  stopRecording,    // Stop recording
  resetRecording    // Clear recording
} = useAudioRecorder();
```

**Usage Example:**
```javascript
const recorder = useAudioRecorder();

// Start recording
<button onClick={recorder.startRecording}>Start</button>

// Stop and save
<button onClick={recorder.stopRecording}>Stop</button>

// Display time
<p>{recorder.recordingTime}s / 60s</p>

// Use blob for upload
if (recorder.audioBlob) {
  await api.createAudio(recorder.audioBlob);
}
```

---

## 📚 Libraries

### Pixi.js
High-performance 2D rendering engine.

**Key Features:**
- WebGL renderer
- Sprite batching for thousands of tiles
- Smooth animations
- Event handling

**Usage:**
```javascript
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x050505,
});
```

---

### Pixi Viewport
Pan and zoom plugin for Pixi.js.

**Features:**
- Drag to pan
- Scroll to zoom
- Pinch to zoom (mobile)
- Momentum scrolling

**Usage:**
```javascript
import { Viewport } from 'pixi-viewport';

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
});

viewport.drag().pinch().wheel().decelerate();
```

---

### Framer Motion
Animation library for React.

**Usage Examples:**

**Fade In:**
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Slide Up:**
```jsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  Content
</motion.div>
```

**Page Transitions:**
```jsx
<AnimatePresence mode="wait">
  {view === 'menu' && (
    <motion.div
      key="menu"
      exit={{ opacity: 0 }}
    >
      <Menu />
    </motion.div>
  )}
</AnimatePresence>
```

---

### TailwindCSS
Utility-first CSS framework.

**Custom Classes:**
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
  @apply bg-monument-accent hover:bg-blue-600 
         text-white font-medium px-6 py-3 
         rounded-lg transition-all;
}

.btn-secondary {
  @apply glass hover:bg-white/10 
         text-white font-medium px-6 py-3 
         rounded-lg transition-all;
}
```

---

## 🎨 Styling Guidelines

### Color Palette

```javascript
// tailwind.config.js
colors: {
  monument: {
    dark: '#0a0a0a',      // Background
    darker: '#050505',     // Deep background
    light: '#f5f5f5',      // Text
    accent: '#3b82f6',     // Primary actions
  },
}
```

### Typography

```css
/* Headers */
.text-5xl font-bold text-white

/* Body */
.text-lg text-gray-300

/* Labels */
.text-sm text-gray-400

/* Monospace (IDs) */
.font-mono text-monument-accent
```

### Spacing

```css
/* Consistent spacing */
gap-4    /* 1rem / 16px */
gap-6    /* 1.5rem / 24px */
gap-8    /* 2rem / 32px */

p-6      /* Padding: 1.5rem */
p-8      /* Padding: 2rem */
```

---

## 🛠️ Utility Functions

### API Client (lib/api.js)

```javascript
import { contributionAPI } from './lib/api';

// Get all contributions
const response = await contributionAPI.getAll(page, limit);

// Find by ID
const contribution = await contributionAPI.getByShortId('HM-ABC123');

// Create text
const result = await contributionAPI.createText('Hello world');

// Create image
const result = await contributionAPI.createImage(file);

// Create drawing
const result = await contributionAPI.createDrawing(dataUrl);

// Create audio
const result = await contributionAPI.createAudio(blob);

// Get stats
const stats = await contributionAPI.getStats();
```

---

### Tile Positioning (lib/tilePositioning.js)

```javascript
import { 
  calculateTilePosition,
  getVisibleTiles,
  calculateZoomToTile,
  TILE_SIZE 
} from './lib/tilePositioning';

// Get position for tile index
const { x, y } = calculateTilePosition(0); // Center
const { x, y } = calculateTilePosition(10); // 10th tile

// Filter visible tiles
const visible = getVisibleTiles(contributions, viewport);

// Calculate zoom parameters
const { x, y, scale } = calculateZoomToTile(
  tile, 
  windowWidth, 
  windowHeight
);
```

---

### Pixi Renderer (lib/pixiRenderer.js)

```javascript
import { createTileSprite, createTileThumbnail } from './lib/pixiRenderer';

// Create full tile sprite
const sprite = createTileSprite(contribution, apiUrl);
viewport.addChild(sprite);

// Create thumbnail for zoomed out view
const thumb = createTileThumbnail(contribution);
viewport.addChild(thumb);
```

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Mobile Considerations

```jsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Smaller text on mobile
<h1 className="text-4xl md:text-6xl">

// Hide on mobile
<div className="hidden md:block">

// Show only on mobile
<div className="block md:hidden">
```

---

## 🧪 Testing (Future)

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

**Recommended Testing Tools:**
- Jest - Test runner
- React Testing Library - Component testing
- Playwright - E2E testing

---

## 🚀 Build & Deploy

### Development Build

```bash
npm run dev
# Runs on http://localhost:5173
```

### Production Build

```bash
npm run build
# Output: dist/

npm run preview
# Preview production build locally
```

### Build Optimization

Vite automatically:
- Minifies code
- Tree-shakes unused code
- Code splits by route
- Optimizes images
- Generates source maps

**Manual Chunks (vite.config.js):**
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'pixi': ['pixi.js', 'pixi-viewport'],
        'react-vendor': ['react', 'react-dom'],
        'motion': ['framer-motion'],
      },
    },
  },
}
```

---

## 🔧 Configuration Files

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

### tailwind.config.js
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { /* custom colors */ },
      animation: { /* custom animations */ },
    },
  },
};
```

### .env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Performance Optimization

### 1. React Optimization

```javascript
// Memoize expensive calculations
const sorted = useMemo(() => 
  contributions.sort((a, b) => a.x - b.x), 
  [contributions]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler
}, [deps]);

// Memoize components
const MemoizedComponent = React.memo(Component);
```

### 2. Pixi.js Optimization

```javascript
// Use sprite batching
const texture = PIXI.Texture.from(url);
const sprites = contributions.map(c => 
  new PIXI.Sprite(texture)
);

// Limit rendering
app.ticker.maxFPS = 60;

// Cull off-screen objects
viewport.cull = true;
```

### 3. Image Optimization

- Use WebP format when possible
- Lazy load images
- Implement progressive loading
- Use appropriate image sizes

---

## 🐛 Common Issues

### Pixi.js not rendering

**Solution:**
```javascript
// Ensure canvas is mounted
useEffect(() => {
  if (!canvasRef.current) return;
  // Initialize Pixi
}, []);
```

### Audio recording fails

**Solution:**
```javascript
// Check browser permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .catch(err => {
    console.error('Microphone access denied:', err);
  });
```

### Tailwind classes not working

**Solution:**
```javascript
// Check tailwind.config.js content paths
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
],
```

### API calls failing

**Solution:**
```env
# Check .env file
VITE_API_URL=http://localhost:5000/api

# Restart dev server after changing .env
npm run dev
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "axios": "^1.6.2",
    "framer-motion": "^10.16.16",
    "pixi-viewport": "^5.0.2",
    "pixi.js": "^7.3.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

---

## 🎯 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Touch gesture improvements
- [ ] Keyboard shortcuts
- [ ] Search functionality
- [ ] Filters (by type, date, etc.)
- [ ] 3D visualization mode
- [ ] Export contribution as image
- [ ] Dark/light mode toggle

---

## 📞 Support

- Report issues: [GitHub Issues](https://github.com/yourusername/the-human-monument/issues)
- Ask questions: [GitHub Discussions](https://github.com/yourusername/the-human-monument/discussions)

---

**Built with ❤️ using React and Pixi.js**
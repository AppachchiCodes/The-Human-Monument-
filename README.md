# The Human Monument

> Interactive infinite canvas for collaborative human expression. Built with React + Pixi.js + Node.js + PostgreSQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

**Live Demo:** [Coming Soon]

---

## What It Does

An infinite zoomable canvas where users contribute text, drawings, images, or audio. Each contribution gets a tile positioned using a spiral algorithm. Think Reddit's r/place meets collaborative digital art.

**Key Features:**
- Infinite pan/zoom canvas (Pixi.js + pixi-viewport)
- 4 contribution types with unique IDs (HM-XXXXX)
- Rate limiting (15 req/15min per IP)
- Position collision detection (no overlapping tiles)
- Optimized for 10k+ tiles

## Tech Stack

Frontend:  React 18 + Vite + Pixi.js 7 + TailwindCSS + Framer Motion
Backend:   Node.js + Express + Prisma ORM
Database:  PostgreSQL 15+
Storage:   Local filesystem (images/drawings/audio)


## Quick Start

```bash
# Start DB
docker-compose up postgres -d

# Backend
cd backend && npm install
cp .env.example .env
npx prisma migrate dev && npx prisma generate
npm run dev  # Port 5000

# Frontend (new terminal)
cd frontend && npm install
cp .env.example .env
npm run dev  # Port 5173
```

**Access:** `http://localhost:5173`

## Architecture

### Data Flow
```
User → React UI → Axios → Express API → Prisma → PostgreSQL
                                    ↓
                              File System (uploads/)
```

### Key Components

**Frontend:**
- `InfiniteWall.jsx` - Pixi.js viewport with click detection
- `ContributeCanvas.jsx` - Multi-step form with file upload
- `lib/tilePositioning.js` - Spiral algorithm (matches backend)
- `lib/pixiRenderer.js` - Tile sprite creation

**Backend:**
- `contributionService.js` - Position calculation + collision detection
- `fileService.js` - Image/audio processing with Sharp
- `idGenerator.js` - Unique ID generation (short-unique-id)

### Database Schema

```prisma
model Contribution {
  id          String   @id @default(uuid())
  shortId     String   @unique        // HM-XXXXX
  x           Float                   // Spiral position
  y           Float
  type        ContributionType        // TEXT | DRAWING | IMAGE | AUDIO
  content     String?                 // For text
  imagePath   String?                 // /uploads/images/...
  drawingPath String?                 // /uploads/drawings/...
  audioPath   String?                 // /uploads/audio/...
  status      Status   @default(APPROVED)
  ipAddress   String?
  createdAt   DateTime @default(now())
}
```

### Spiral Positioning Algorithm

Tiles are positioned in a spiral pattern starting from (0,0):
```
Position 0: (0, 0)
Position 1: (0, -150)
Position 2: (150, -150)
Position 3: (150, 0)
...
```

**TILE_SIZE:** 150px with 10px visual padding in frontend only.

**Collision Detection:** Backend checks all existing positions before assigning coordinates.

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Endpoints

```http
POST   /contributions          # Create contribution
GET    /contributions          # List all (paginated)
GET    /contributions/:shortId # Get by ID
GET    /contributions/stats    # Get statistics
```

### Create Contribution

```http
POST /contributions
Content-Type: multipart/form-data

type: TEXT | DRAWING | IMAGE | AUDIO
content: string (for TEXT)
drawing: dataURL (for DRAWING)
image: file (for IMAGE, max 5MB)
audio: file (for AUDIO, max 10MB)
```

**Response:**
```json
{
  "success": true,
  "message": "Contribution created successfully",
  "data": {
    "id": "uuid",
    "shortId": "HM-ABC123",
    "x": 0,
    "y": 0,
    "type": "TEXT",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Rate Limit:** 15 requests per 15 minutes per IP.

## Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5433/human_monument"
CORS_ORIGIN=http://localhost:5173

MAX_IMAGE_SIZE=5242880      # 5MB
MAX_AUDIO_SIZE=10485760     # 10MB
MAX_DRAWING_SIZE=2097152    # 2MB

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=15
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Development

### Useful Commands

```bash
# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Format code
npm run format

# Lint
npm run lint
```

### Adding Features

1. **New contribution type:**
   - Update `ContributionType` enum in `prisma/schema.prisma`
   - Add handler in `contributionService.js`
   - Create UI in `ContributeCanvas.jsx`
   - Add renderer in `pixiRenderer.js`

2. **New API endpoint:**
   - Add route in `backend/src/routes/contributions.js`
   - Add controller method
   - Add validation rules

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick checklist:**
- Branch from `main`
- Follow existing code style
- Test locally
- Write clear commit messages
- Open PR with description

## Performance Notes

- **Pixi.js** handles 10k+ tiles at 60fps
- **Viewport culling** recommended beyond 50k tiles
- **Database indexes** on x, y, shortId for fast queries
- **Sharp** optimizes images on upload
- **Rate limiting** prevents abuse

## Known Issues

- Drag conflicts with tile clicks on some touch devices
- Free tier backend (Render) sleeps after 15min inactivity
- File storage is ephemeral on free hosting (migrate to S3 for production)


## License
MIT - See [LICENSE](LICENSE)

## Credits

Built with ❤️ by the open-source community.

**Core Technologies:**
- [Pixi.js](https://pixijs.com/) - Canvas rendering
- [pixi-viewport](https://github.com/davidfig/pixi-viewport) - Pan/zoom
- [Prisma](https://www.prisma.io/) - ORM
- [Vite](https://vitejs.dev/) - Build tool


**⭐ Star this repo if you find it useful!**
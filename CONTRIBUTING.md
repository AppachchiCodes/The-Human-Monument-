# Contributing to The Human Monument

Thanks for considering contributing! Here's what you need to know.

---

## Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/the-human-monument.git
cd the-human-monument

# Start dependencies
docker-compose up postgres -d
cd backend && npm install && npx prisma migrate dev
cd ../frontend && npm install

# Run dev servers
npm run dev  # in both backend/ and frontend/
```

---

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Follow existing code patterns
   - Keep commits atomic
   - Test locally

3. **Format and lint**
   ```bash
   npm run format
   npm run lint
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add tile rotation feature"
   ```

5. **Push and open PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Code Standards

### General
- **ES6+** syntax
- **Functional components** for React (hooks over classes)
- **Async/await** over callbacks
- **Descriptive names** for functions and variables

### Backend
```javascript
// ✅ Good
async createContribution(data, files, ipAddress) {
  const shortId = generateContributionId();
  // ...
}

// ❌ Avoid
function create(d, f, ip) { /* ... */ }
```

### Frontend
```javascript
// ✅ Good
const [selectedTile, setSelectedTile] = useState(null);

// ❌ Avoid
const [tile, setTile] = useState(null);
```

### File Structure
- Components in `PascalCase.jsx`
- Utilities in `camelCase.js`
- One component per file
- Co-locate tests with components

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve tile overlap bug
docs: update API documentation
refactor: simplify spiral algorithm
perf: optimize Pixi.js rendering
test: add contribution service tests
chore: update dependencies
```

---

## PR Guidelines

### Before Opening PR
- [ ] Code builds without errors
- [ ] Lint passes (`npm run lint`)
- [ ] Tested locally (all 4 contribution types)
- [ ] No console errors in browser
- [ ] Database migrations work

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
How to test these changes

## Screenshots (if applicable)
Before/after images
```

### Review Process
- Maintainer will review within 48 hours
- Address feedback in new commits
- Squash commits before merge (maintainer may do this)

---

## What to Contribute

### Good First Issues
- UI improvements (colors, animations, responsive)
- Documentation fixes
- Test coverage
- Performance optimizations

### Feature Ideas
- Search functionality
- User accounts
- Moderation dashboard
- Tile filters
- Export features
- Mobile gestures

### Bug Reports
Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, browser, Node version)
- Screenshots/logs

---

## Architecture Guidelines

### Adding New Contribution Type

1. Update schema:
```prisma
// backend/prisma/schema.prisma
enum ContributionType {
  TEXT
  DRAWING
  IMAGE
  AUDIO
  VIDEO  // ← new type
}
```

2. Add service handler:
```javascript
// backend/src/services/contributionService.js
case 'VIDEO':
  contributionData.videoPath = await fileService.saveVideo(files.video[0]);
  break;
```

3. Add frontend UI:
```javascript
// frontend/src/components/ContributeCanvas.jsx
{type === 'VIDEO' && (
  <VideoRecorder onCapture={setVideoData} />
)}
```

4. Add renderer:
```javascript
// frontend/src/lib/pixiRenderer.js
case 'VIDEO':
  // Create video tile sprite
  break;
```

### Adding New API Endpoint

```javascript
// backend/src/routes/contributions.js
router.get('/trending', contributionController.getTrending);

// backend/src/controllers/contributionController.js
async getTrending(req, res, next) {
  const trending = await contributionService.getTrending();
  res.json({ success: true, data: trending });
}
```


## Testing

Currently no test suite (contributions welcome!).

**Recommended stack:**
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library
- E2E: Playwright


## Questions?

- Open a [GitHub Discussion](https://github.com/yourusername/the-human-monument/discussions)
- Check existing [Issues](https://github.com/yourusername/the-human-monument/issues)
- Join our Discord: [Coming Soon]



## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help newcomers

We follow the [Contributor Covenant](https://www.contributor-covenant.org/).



**Thanks for contributing!**
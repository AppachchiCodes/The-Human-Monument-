export const TILE_SIZE = 150;
export const TILE_PADDING = 10;
export const TILE_TOTAL_SIZE = TILE_SIZE + TILE_PADDING;

/**
 * Calculate tile position using spiral algorithm (matches backend)
 */
export function calculateTilePosition(index) {
  if (index === 0) return { x: 0, y: 0 };

  let x = 0, y = 0;
  let dx = 0, dy = -1;
  let segment = 1;
  let segmentPassed = 0;

  for (let i = 0; i < index; i++) {
    x += dx * TILE_TOTAL_SIZE;
    y += dy * TILE_TOTAL_SIZE;
    segmentPassed++;

    if (segmentPassed === segment) {
      segmentPassed = 0;
      const temp = dx;
      dx = -dy;
      dy = temp;

      if (dy === 0) {
        segment++;
      }
    }
  }

  return { x, y };
}

/**
 * Calculate visible tiles based on viewport
 */
export function getVisibleTiles(contributions, viewport) {
  const { x, y, scale } = viewport;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Calculate visible bounds with margin
  const margin = 500;
  const left = -x / scale - margin;
  const right = (-x + screenWidth) / scale + margin;
  const top = -y / scale - margin;
  const bottom = (-y + screenHeight) / scale + margin;

  return contributions.filter((tile) => {
    return (
      tile.x + TILE_SIZE >= left &&
      tile.x <= right &&
      tile.y + TILE_SIZE >= top &&
      tile.y <= bottom
    );
  });
}

/**
 * Calculate zoom level to focus on a specific tile
 */
export function calculateZoomToTile(tile, viewportWidth, viewportHeight) {
  const targetScale = 1.5;
  const centerX = -(tile.x - viewportWidth / (2 * targetScale) + TILE_SIZE / 2);
  const centerY = -(tile.y - viewportHeight / (2 * targetScale) + TILE_SIZE / 2);

  return {
    x: centerX,
    y: centerY,
    scale: targetScale,
  };
}
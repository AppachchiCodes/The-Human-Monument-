import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { useContributions } from '../hooks/useContributions';
import { createTileSprite } from '../lib/pixiRenderer';
import { calculateZoomToTile } from '../lib/tilePositioning';
import TileModal from './TileModal';
import LoadingSpinner from './LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function InfiniteWall({ onBack, targetTile, onTargetReached }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const viewportRef = useRef(null);
  const tilesRef = useRef(new Map());
  const contributionsRef = useRef([]);
  const isDraggingRef = useRef(false);

  const { contributions, loading, error, stats } = useContributions();
  const [selectedTile, setSelectedTile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update contributions ref when contributions change
  useEffect(() => {
    contributionsRef.current = contributions;
  }, [contributions]);

  // Initialize Pixi.js application
  useEffect(() => {
    if (appRef.current) return;

    const initPixi = () => {
      if (!canvasRef.current) {
        setTimeout(initPixi, 100);
        return;
      }

      const canvas = canvasRef.current;
      
      try {
  // Try multiple renderer strategies for maximum compatibility
  let app;
      try {
        app = new PIXI.Application({
          view: canvas,
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: 0x050505,
          antialias: false,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          // Explicit renderer preference for Chrome iOS
          preference: 'webgl',
        });
      } catch (webglError) {
        // Fallback to canvas renderer if WebGL fails
        console.warn('WebGL failed, falling back to canvas:', webglError);
        app = new PIXI.Application({
          view: canvas,
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: 0x050505,
          forceCanvas: true,
          resolution: 1,
        });
      }

      const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 10000,
        worldHeight: 10000,
        events: app.renderer.events,
      });

      viewport.eventMode = 'static';
      viewport.interactiveChildren = true;

      app.stage.addChild(viewport);

      // Configure plugins
      viewport
        .drag()
        .wheel()
        .pinch()
        .decelerate({ friction: 0.9 });

      viewport.clampZoom({ minScale: 0.1, maxScale: 2 });
      viewport.moveCenter(0, 0);

      // Track if user is dragging
      viewport.on('drag-start', () => {
        isDraggingRef.current = true;
      });

      viewport.on('drag-end', () => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 100);
      });

      // Handle clicks
      viewport.on('pointerup', (event) => {
        if (isDraggingRef.current) return;
        const worldPoint = viewport.toWorld(event.global);
        
        for (const [id, tile] of tilesRef.current.entries()) {
          const tileX = tile.x;
          const tileY = tile.y;
          const tileWidth = 150;
          const tileHeight = 150;
          
          if (worldPoint.x >= tileX && 
              worldPoint.x <= tileX + tileWidth &&
              worldPoint.y >= tileY && 
              worldPoint.y <= tileY + tileHeight) {
            const contribution = contributionsRef.current.find(c => c.id === id);
            if (contribution) {
              setSelectedTile(contribution);
            }
            return;
          }
        }
      });

      appRef.current = app;
      viewportRef.current = viewport;
      setIsInitialized(true);

    } catch (error) {
      console.error('Pixi initialization error:', error);
      alert('Failed to initialize canvas: ' + error.message);
    }
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
        viewportRef.current = null;
      }
    };
  }, []);

  // Render contributions
  useEffect(() => {
    if (!isInitialized || !viewportRef.current || loading) return;

    const viewport = viewportRef.current;

    // Clear existing tiles properly
    tilesRef.current.forEach(tile => {
      viewport.removeChild(tile);
      tile.destroy({ children: true, texture: false, baseTexture: false });
    });
    tilesRef.current.clear();

    // Track which contributions we've rendered to avoid duplicates
    const renderedIds = new Set();
  
    contributions.forEach((contribution) => {
      // Skip if already rendered
      if (renderedIds.has(contribution.id)) {
        console.warn('Skipping duplicate contribution:', contribution.id);
        return;
      }
      renderedIds.add(contribution.id);

      try {
        const tileSprite = createTileSprite(contribution, API_URL);
        viewport.addChild(tileSprite);
        tilesRef.current.set(contribution.id, tileSprite);
      } catch (error) {
        console.error('Error creating tile:', error);
      }
    });

    console.log(`Rendered ${tilesRef.current.size} tiles`);
  }, [contributions, isInitialized, loading]);

  // Handle target tile (from Find feature)
  useEffect(() => {
    if (!targetTile || !viewportRef.current || !isInitialized) return;

    const viewport = viewportRef.current;
    const { x, y, scale } = calculateZoomToTile(
      targetTile,
      window.innerWidth,
      window.innerHeight
    );

    viewport.animate({
      position: { x, y },
      scale,
      time: 1000,
      ease: 'easeInOutCubic',
      callbackOnComplete: () => {
        const tile = tilesRef.current.get(targetTile.id);
        if (tile) {
          let flash = 0;
          const flashInterval = setInterval(() => {
            tile.alpha = flash % 2 === 0 ? 0.5 : 1;
            flash++;
            if (flash > 6) {
              clearInterval(flashInterval);
              tile.alpha = 1;
            }
          }, 200);
        }
        onTargetReached?.();
      },
    });
  }, [targetTile, isInitialized, onTargetReached]);

  if (loading && contributions.length === 0) {
    return <LoadingSpinner message="Loading the monument..." />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Failed to load contributions</p>
          <p className="text-gray-400">{error}</p>
          <button onClick={onBack} className="btn-primary mt-6">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />

      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBack}
          className="btn-secondary pointer-events-auto"
        >
          ← Back to Menu
        </button>

        <div className="glass px-6 py-3 rounded-full pointer-events-auto">
          <p className="text-white font-medium">
            {stats.total.toLocaleString()} Contributions
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full pointer-events-none">
        <p className="text-gray-300 text-sm">
          Drag to pan - Scroll to zoom - Click tiles to view
        </p>
      </div>

      {selectedTile && (
        <TileModal
          contribution={selectedTile}
          onClose={() => setSelectedTile(null)}
        />
      )}
    </div>
  );
}
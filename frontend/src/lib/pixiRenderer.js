import * as PIXI from 'pixi.js';
import { TILE_SIZE } from './tilePositioning';

export function createTileSprite(contribution, apiUrl) {
  const container = new PIXI.Container();
  container.x = contribution.x;
  container.y = contribution.y;
  container.eventMode = 'static';
  container.cursor = 'pointer';
  
  // IMPORTANT: Keep interactiveChildren true so tiles can be clicked
  container.interactiveChildren = true;

  // Background
  const background = new PIXI.Graphics();
  background.beginFill(0x1a1a1a);
  background.lineStyle(2, 0x333333);
  background.drawRoundedRect(0, 0, TILE_SIZE, TILE_SIZE, 8);
  background.endFill();
  
  // Make background non-interactive so it doesn't block events
  background.eventMode = 'none';
  container.addChild(background);

  // Content based on type
  switch (contribution.type) {
    case 'TEXT':
      const text = new PIXI.Text(contribution.content, {
        fontFamily: 'Inter',
        fontSize: 14,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: TILE_SIZE - 20,
        align: 'left',
      });
      text.x = 10;
      text.y = 10;
      text.eventMode = 'none'; // Text doesn't need to be interactive
      container.addChild(text);
      break;

    case 'IMAGE':
      if (contribution.imagePath) {
        const imageUrl = `${apiUrl.replace('/api', '')}${contribution.imagePath}`;
        const sprite = PIXI.Sprite.from(imageUrl);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        sprite.eventMode = 'none'; // Image doesn't need separate interaction
        container.addChild(sprite);
      }
      break;

    case 'DRAWING':
      if (contribution.drawingPath) {
        const drawingUrl = `${apiUrl.replace('/api', '')}${contribution.drawingPath}`;
        const sprite = PIXI.Sprite.from(drawingUrl);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        sprite.eventMode = 'none'; // Drawing doesn't need separate interaction
        container.addChild(sprite);
      }
      break;

    case 'AUDIO':
      const audioBackground = new PIXI.Graphics();
      audioBackground.beginFill(0x3b82f6);
      audioBackground.drawRoundedRect(10, 10, TILE_SIZE - 20, TILE_SIZE - 20, 8);
      audioBackground.endFill();
      audioBackground.eventMode = 'none'; // Background doesn't need interaction
      container.addChild(audioBackground);
      
      const playIcon = new PIXI.Graphics();
      playIcon.beginFill(0xffffff);
      playIcon.moveTo(TILE_SIZE / 2 - 10, TILE_SIZE / 2 - 15);
      playIcon.lineTo(TILE_SIZE / 2 - 10, TILE_SIZE / 2 + 15);
      playIcon.lineTo(TILE_SIZE / 2 + 15, TILE_SIZE / 2);
      playIcon.closePath();
      playIcon.endFill();
      playIcon.eventMode = 'none'; // Icon doesn't need separate interaction
      container.addChild(playIcon);
      
      const audioText = new PIXI.Text('AUDIO', {
        fontFamily: 'Inter',
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: 'bold',
      });
      audioText.anchor.set(0.5);
      audioText.x = TILE_SIZE / 2;
      audioText.y = TILE_SIZE - 25;
      audioText.eventMode = 'none'; // Text doesn't need separate interaction
      container.addChild(audioText);
      break;
  }

  // Hover effect
  container.on('pointerover', () => {
    background.tint = 0xcccccc;
    container.scale.set(1.05);
  });

  container.on('pointerout', () => {
    background.tint = 0xffffff;
    container.scale.set(1);
  });

  return container;
}

export function createTileThumbnail(contribution) {
  const graphics = new PIXI.Graphics();
  
  const colors = {
    TEXT: 0x3b82f6,
    IMAGE: 0x10b981,
    DRAWING: 0xf59e0b,
    AUDIO: 0xef4444,
  };

  graphics.beginFill(colors[contribution.type] || 0x6b7280);
  graphics.drawRect(contribution.x, contribution.y, TILE_SIZE, TILE_SIZE);
  graphics.endFill();

  return graphics;
}
# RedButtonMeme Component Usage Guide

The `RedButtonMeme` component displays the red button meme image with typewriter text overlay functionality. It combines image display with animated text effects.

## Basic Usage

```tsx
import { RedButtonMeme } from '../components/RedButtonMeme';
import { Vector2 } from '@motion-canvas/core/lib/types';

// Basic usage in a scene
export default makeScene2D(function* (view) {
  const redButtonMeme = createRef<RedButtonMeme>();

  view.add(
    <RedButtonMeme
      ref={redButtonMeme}
      imageSize={new Vector2(600, 400)}
      textPosition={new Vector2(0, 100)}
      textSize="lg"
      textColorType="primary"
    />,
  );

  // Animate typewriter text
  yield* redButtonMeme().typewrite("Don't press the red button!", 2);
});
```

## Props

- `imageSize`: Vector2 - Size of the meme image (default: new Vector2(400, 300))
- `text`: string - Text to display over the image
- `textColorType`: ColorType - Color theme for text (default: 'primary')
- `textSize`: Size - Text size ('3xl', '2xl', 'xl', 'lg', 'md', 'sm') (default: 'md')
- `textPosition`: Vector2 - Position offset for text relative to image center (default: new Vector2(0, 0))

**Note**: Vector2 properties must be created using `new Vector2(x, y)` constructor, not plain arrays.

## Methods

### `typewrite(text, duration, delay)`

Animates text character by character from left to right.

- `text`: The text to animate
- `duration`: Total animation duration in seconds (default: 1)
- `delay`: Delay before starting animation in seconds (default: 0)

### `clearText()`

Clear all text content.

### `getTextComponent()`

Returns the internal StyledText component for advanced text manipulation.

### `getImageComponent()`

Returns the internal Img component for advanced image manipulation.

## Example Scene

```tsx
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { RedButtonMeme } from '../components/RedButtonMeme';
import { waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const meme = createRef<RedButtonMeme>();

  view.add(
    <RedButtonMeme
      ref={meme}
      imageSize={new Vector2(800, 600)}
      textPosition={new Vector2(0, 150)}
      textSize="xl"
      textColorType="secondary"
    />,
  );

  // Sequence of text animations
  yield* meme().typewrite('When you see a red button...', 2);
  yield* waitFor(1);

  yield* meme().clearText();
  yield* meme().typewrite("DON'T PRESS IT!", 1.5);

  yield* waitFor(2);
});
```

## Positioning Text

Text position is relative to the image center. Common positions:

- `new Vector2(0, 150)` - Below the image
- `new Vector2(0, -150)` - Above the image
- `new Vector2(-200, 0)` - Left side of image
- `new Vector2(200, 0)` - Right side of image
- `new Vector2(0, 0)` - Center of image

## Integration with Other Components

The component can be combined with other Motion Canvas components for complex animations:

```tsx
// Animate the entire meme component
yield * meme().scale(0).scale(1, 0.5);
yield * meme().position().to([300, 0], 1);
yield * meme().typewrite('Animated meme text!', 2);
```

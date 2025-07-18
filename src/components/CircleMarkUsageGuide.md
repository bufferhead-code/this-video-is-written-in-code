# CircleMark Component Usage Guide

The `CircleMark` component creates authentic hand-drawn circle annotations using real SVG path data. It can be animated to simulate drawing with a marker or pen, with natural gaps and imperfections.

## Features

✅ **Authentic hand-drawn style** - Uses real SVG path data for genuinely natural, irregular circles  
✅ **Natural gaps and imperfections** - Built-in incomplete circle design for realistic hand-drawn feel  
✅ **Smooth spline animation** - Animates drawing using Motion Canvas Spline with proper curve following  
✅ **Dynamic scaling** - Automatically scales the authentic path points to any size  
✅ **Configurable smoothness** - Optimized smoothness (0.6) for natural curve appearance  
✅ **Perfect for annotations** - Ideal for highlighting elements with authentic hand-drawn aesthetics

## Quick Start

```tsx
import { CircleMark } from '../components/CircleMark';
import { createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circleRef = createRef<CircleMark>();

  view.add(
    <CircleMark
      ref={circleRef}
      size={200}
      strokeColor="#FF3333"
      strokeWidth={6}
      x={300}
      y={150}
    />,
  );

  // Animate the circle being drawn
  yield* circleRef().drawCircle(1.5, 0.5);
});
```

## Properties

### Core Properties

| Property         | Type            | Default     | Description                                           |
| ---------------- | --------------- | ----------- | ----------------------------------------------------- |
| `size`           | `number`        | `200`       | Diameter of the circle in pixels (scales the SVG path) |
| `strokeColor`    | `PossibleColor` | `'#E53E3E'` | Color of the circle stroke                           |
| `strokeWidth`    | `number`        | `8`         | Width of the stroke in pixels                        |
| `handDrawnStyle` | `boolean`       | `true`      | Whether to use authentic SVG path vs perfect circle |
| `gapSize`        | `number`        | `0.1`       | Size of the hand-drawn gap (0-1, where 0.1 = 10% gap) |

### Standard Node Properties

The component also supports all standard Motion Canvas Node properties like `x`, `y`, `opacity`, `scale`, `rotation`, etc.

## Methods

### `drawCircle(duration?: number, delay?: number)`

Animates the drawing of the circle mark from start to finish.

```tsx
// Basic usage - 1.5 second draw with no delay
yield * circleRef().drawCircle();

// Custom timing - 2 seconds with 0.5 second delay
yield * circleRef().drawCircle(2.0, 0.5);
```

### `showComplete()`

Instantly shows the complete circle without animation.

```tsx
circleRef().showComplete();
```

### `hide()` / `show()`

Hide or show the circle mark.

```tsx
circleRef().hide();
yield * waitFor(1);
circleRef().show();
```

## Examples

### Example 1: Basic Red Circle Annotation

```tsx
<CircleMark size={150} strokeColor="#FF3333" strokeWidth={6} x={400} y={200} />
```

### Example 2: Large Perfect Circle

```tsx
<CircleMark
  size={300}
  strokeColor="#00FF00"
  strokeWidth={10}
  handDrawnStyle={false}
  x={0}
  y={0}
/>
```

### Example 3: Small Hand-drawn Marker

```tsx
<CircleMark
  size={80}
  strokeColor="#FF6B35"
  strokeWidth={4}
  handDrawnStyle={true}
  x={-200}
  y={-100}
/>
```

### Example 4: Animated Sequence

```tsx
import { CircleMark } from '../components/CircleMark';
import { createRef } from '@motion-canvas/core';
import { all, waitFor } from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  const circle1Ref = createRef<CircleMark>();
  const circle2Ref = createRef<CircleMark>();

  view.add(
    <CircleMark
      ref={circle1Ref}
      size={120}
      strokeColor="#FF3333"
      x={-200}
      y={0}
    />,
  );

  view.add(
    <CircleMark
      ref={circle2Ref}
      size={120}
      strokeColor="#3333FF"
      x={200}
      y={0}
    />,
  );

  // Draw both circles simultaneously
  yield* all(
    circle1Ref().drawCircle(1.5),
    circle2Ref().drawCircle(1.5, 0.3), // Second circle starts 0.3s later
  );

  yield* waitFor(1);

  // Scale and fade animations
  yield* all(
    circle1Ref().scale(1.5, 0.8),
    circle2Ref().scale(1.5, 0.8),
    circle1Ref().opacity(0.5, 0.8),
    circle2Ref().opacity(0.5, 0.8),
  );
});
```

## Tips

- **Authentic hand-drawn style**: The default style uses real SVG path data from an actual hand-drawn circle for maximum authenticity
- **Perfect circles**: Set `handDrawnStyle={false}` for mathematically perfect circles when precision is needed
- **Size scaling**: The component automatically scales the original SVG path points to match your specified size
- **Natural gaps**: The built-in gap creates the authentic incomplete circle look of real hand-drawn annotations
- **Smooth animation**: Uses Motion Canvas Spline with optimized smoothness (0.6) for natural curve following
- **Performance**: The component uses reactive signals and efficient Spline rendering for smooth performance
- **Layering**: Use `zIndex` to control layering when overlapping with other elements

## Integration with Other Components

The CircleMark component works well with other annotation components:

```tsx
// Circle around important text
<TextMarker ... />
<CircleMark size={200} x={400} y={100} />

// Multiple annotations
<Browser ... />
<CircleMark size={150} x={300} y={200} strokeColor="#FF3333" />
<CircleMark size={100} x={500} y={350} strokeColor="#33FF33" />
```

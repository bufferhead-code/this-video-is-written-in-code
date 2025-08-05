# TextMarker Component Usage Guide

The TextMarker component creates animated highlight effects for text elements, now with configurable composite operations for different visual themes.

## Basic Usage

```tsx
import { TextMarker } from '../components/TextMarker';
import { Txt } from '@motion-canvas/2d/lib/components';

// Create text to highlight
const text = new Txt({
  text: 'Hello World',
  fontSize: 48,
  fill: '#333333',
});

// Create marker with default settings
const marker = new TextMarker({
  markerColor: '#FFD700',
  markerOpacity: 0.7,
  markerThickness: 4,
});

marker.add(text);
view.add(marker);
```

## Composite Operation for Light/Dark Modes

The `markerCompositeOperation` prop allows you to configure how the marker blends with the background, making it suitable for different color schemes:

### Light Mode (Light Backgrounds)
```tsx
const lightModeMarker = new TextMarker({
  markerColor: '#FFD700', // Gold
  markerOpacity: 0.7,
  markerThickness: 4,
  markerCompositeOperation: 'multiply', // Good for light backgrounds
});
```

### Dark Mode (Dark Backgrounds)
```tsx
const darkModeMarker = new TextMarker({
  markerColor: '#00FFFF', // Cyan
  markerOpacity: 0.8,
  markerThickness: 6,
  markerCompositeOperation: 'lighter', // Good for dark backgrounds
});
```

### Other Composite Operations
```tsx
// Overlay effect
const overlayMarker = new TextMarker({
  markerCompositeOperation: 'overlay',
});

// Screen effect (brightens)
const screenMarker = new TextMarker({
  markerCompositeOperation: 'screen',
});

// Soft light effect
const softLightMarker = new TextMarker({
  markerCompositeOperation: 'soft-light',
});
```

## Available Composite Operations

- `'lighter'` (default) - Adds colors, good for dark backgrounds
- `'multiply'` - Multiplies colors, good for light backgrounds
- `'overlay'` - Combines multiply and screen, creates contrast
- `'screen'` - Brightens colors
- `'soft-light'` - Similar to overlay but softer
- `'hard-light'` - Similar to overlay but more intense
- `'color-dodge'` - Brightens by decreasing contrast
- `'color-burn'` - Darkens by increasing contrast
- `'darken'` - Shows darker of two colors
- `'lighten'` - Shows lighter of two colors

## Animation Methods

### Marker Pen Effect
```tsx
yield* marker.animateMarkerPen(0.5); // Draws from left to right
```

### Fade In Effect
```tsx
yield* marker.animateFadeIn(0.5); // Simple fade in
```

### Typewriter Effect
```tsx
yield* marker.animateTypewriter(0.5, 0.05); // Appears as text is "typed"
```

### Pulse Effect
```tsx
yield* marker.animatePulse(0.5, 3); // Pulses 3 times
```

## Dynamic Style Updates

You can update marker properties at runtime:

```tsx
marker.setMarkerStyle({
  color: '#FF6B6B',
  opacity: 0.8,
  thickness: 8,
  compositeOperation: 'overlay',
});
```

## Complete Example

```tsx
import { makeScene2D } from '@motion-canvas/2d';
import { TextMarker } from '../components/TextMarker';
import { Txt } from '@motion-canvas/2d/lib/components';
import { fadeTransition } from '../animation';

export default makeScene2D(function* (view) {
  yield* fadeTransition(1);

  const text = new Txt({
    text: 'Highlighted Text',
    fontSize: 48,
    fill: '#333333',
  });

  view.add(text);

  // Light mode marker
  const lightMarker = new TextMarker({
    markerColor: '#FFD700',
    markerOpacity: 0.7,
    markerThickness: 4,
    markerCompositeOperation: 'multiply',
  });

  lightMarker.add(text);
  view.add(lightMarker);

  yield* lightMarker.animateMarkerPen(0.5);
  yield* view.waitFor(2);

  // Switch to dark mode
  text.fill('#FFFFFF');
  
  const darkMarker = new TextMarker({
    markerColor: '#00FFFF',
    markerOpacity: 0.8,
    markerThickness: 6,
    markerCompositeOperation: 'lighter',
  });

  darkMarker.add(text);
  view.add(darkMarker);

  yield* darkMarker.animateFadeIn(0.5);
});
```

## Tips for Best Results

1. **Light backgrounds**: Use `'multiply'` with darker marker colors
2. **Dark backgrounds**: Use `'lighter'` with brighter marker colors
3. **High contrast**: Use `'overlay'` for dramatic effects
4. **Subtle highlighting**: Use `'soft-light'` with lower opacity
5. **Text readability**: Ensure sufficient contrast between text and marker colors 
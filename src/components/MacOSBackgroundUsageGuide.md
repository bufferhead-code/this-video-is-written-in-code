# MacOSBackground Component Usage Guide

The `MacOSBackground` component creates an authentic macOS Big Sur desktop background with configurable menu bar and dock elements.

## Features

✅ **Authentic macOS Big Sur-style wallpaper** - Colorful gradient background with subtle abstract shapes  
✅ **Configurable Menu Bar** - Can be shown or hidden, includes Apple logo, app menus, system icons, and time  
✅ **Configurable Dock** - Can be shown or hidden, includes realistic app icons with shadows  
✅ **Perfect aspect ratio** - Designed for 1440x900 video resolution  
✅ **Animatable properties** - All elements can be animated and controlled via signals  
✅ **Blur effects** - Authentic glassmorphism with translucent menu bar background  
✅ **SF Pro Text typography** - Proper macOS typography with text shadows  

## Quick Start

```tsx
import { MacOSBackground } from '../components/MacOSBackground';
import { createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<MacOSBackground>();
  
  view.add(
    <MacOSBackground
      ref={backgroundRef}
      showMenuBar={true}
      showDock={true}
    />
  );
  
  // Hide dock after 2 seconds with smooth animation
  yield* waitFor(2);
  yield* backgroundRef().animateDock(false, 0.5);
});
```

## Properties

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showMenuBar` | `boolean` | `true` | Whether to show the menu bar at the top |
| `showDock` | `boolean` | `true` | Whether to show the dock at the bottom |
| `wallpaperColor` | `PossibleColor` | `'#2C63D2'` | Primary color for the wallpaper gradient |

### Animation Examples

```tsx
// Animate menu bar visibility with smooth transition
yield* backgroundRef().animateMenuBar(false, 1.0);

// Animate dock visibility with smooth transition
yield* backgroundRef().animateDock(false, 0.8);

// Animate both with different timings
yield* backgroundRef().animateDock(true, 0.5);   // Show dock quickly
yield* backgroundRef().animateMenuBar(true, 1.0); // Show menu bar slowly

// Create a clean desktop (no UI elements)
yield* all(
  backgroundRef().animateMenuBar(false, 0.5),
  backgroundRef().animateDock(false, 0.5)
);

// Bring back the full desktop
yield* all(
  backgroundRef().animateMenuBar(true, 0.5),
  backgroundRef().animateDock(true, 0.5)
);

// Advanced animation sequence
yield* backgroundRef().animateDock(true, 0.3);     // Show dock fast
yield* waitFor(1);
yield* backgroundRef().animateMenuBar(true, 0.8);  // Show menu bar slowly
yield* waitFor(2);
yield* all(
  backgroundRef().animateDock(false, 0.5),         // Hide both simultaneously
  backgroundRef().animateMenuBar(false, 0.5)
);
```

## Menu Bar Elements

The menu bar includes:
- **Apple logo** (left side)
- **App menus** (Finder, File, Edit, View, Go, Window, Help)
- **System icons** (Battery, Control Center, Search, WiFi)
- **Date and time** display (Mon Jun 22, 9:41 AM)
- **Blur effect** with translucent background
- **SF Pro Text typography** with proper shadows

## Dock Elements

The dock includes:
- **9 app icons** with authentic macOS colors
- **Glassmorphism effect** with translucent background
- **Realistic shadows** and rounded corners
- **Proper spacing** and sizing

## Use Cases

### Full Desktop View
```tsx
<MacOSBackground showMenuBar={true} showDock={true} />
```

### Clean Background (no UI)
```tsx
<MacOSBackground showMenuBar={false} showDock={false} />
```

### Menu Bar Only
```tsx
<MacOSBackground showMenuBar={true} showDock={false} />
```

### Dock Only
```tsx
<MacOSBackground showMenuBar={false} showDock={true} />
```

## Positioning

The component automatically centers itself and fills the entire 1440x900 canvas. The menu bar appears at the top (y: -450 + 12) and the dock appears at the bottom (y: 450 - 60).

## Integration Tips

1. **Layer Order**: Place the MacOSBackground component first in your view hierarchy so other windows and content appear on top
2. **Animation Timing**: Use consistent timing (0.5s) for showing/hiding UI elements for authentic feel. Use `animateDock()` and `animateMenuBar()` for smooth transitions instead of direct signal changes
3. **Color Harmony**: The colorful gradient works well with most content, but you can customize the wallpaperColor if needed
4. **Typography**: The component uses SF Pro Text font family for authentic macOS appearance
5. **Blur Effects**: Menu bar features authentic macOS blur effects and translucency

## Example Scene Structure

```tsx
export default makeScene2D(function* (view) {
  const backgroundRef = createRef<MacOSBackground>();
  const appWindowRef = createRef<SomeAppWindow>();
  
  // 1. Add background first
  view.add(
    <MacOSBackground ref={backgroundRef} />
  );
  
  // 2. Add app windows and content on top
  view.add(
    <SomeAppWindow ref={appWindowRef} />
  );
  
  // 3. Animate as needed
  yield* backgroundRef().animateDock(false, 0.5);
});
```

This component provides a professional foundation for any macOS-themed animations or demonstrations, now with authentic macOS Big Sur styling and proper typography. 
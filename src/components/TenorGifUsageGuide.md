# TenorGif Component Usage Guide

The `TenorGif` component allows you to embed Tenor GIFs in your Motion Canvas animations with rounded corners and box shadows.

## Basic Usage

### Using the Function Component (Recommended)

```tsx
import { TenorGifComponent } from './components/TenorGif';

// In your scene:
<TenorGifComponent
  tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
  width={400}
  height={300}
  radius={12}
  shadowColor="rgba(0, 0, 0, 0.2)"
  shadowBlur={10}
  shadowOffsetY={5}
/>;
```

### Using the Class Component

```tsx
import { TenorGif } from './components/TenorGif';
import { createRef } from '@motion-canvas/core/lib/utils';

// In your scene function:
const gifRef = createRef<TenorGif>();

view.add(
  <TenorGif
    ref={gifRef}
    tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
    width={400}
    height={300}
  />,
);

// Animate the GIF
yield * gifRef().animateIn(1);
yield * waitFor(3);
yield * gifRef().animateOut(0.5);
```

## Props

### TenorGifProps

| Prop            | Type                  | Default                | Description                                         |
| --------------- | --------------------- | ---------------------- | --------------------------------------------------- |
| `tenorUrl`      | `SignalValue<string>` | `''`                   | Full Tenor URL (e.g., `https://tenor.com/view/...`) |
| `tenorId`       | `SignalValue<string>` | `''`                   | Just the Tenor ID (e.g., `361299607546324637`)      |
| `width`         | `SignalValue<number>` | `400`                  | Width of the GIF in pixels                          |
| `height`        | `SignalValue<number>` | `300`                  | Height of the GIF in pixels                         |
| `radius`        | `SignalValue<number>` | `12`                   | Border radius for rounded corners                   |
| `shadowColor`   | `SignalValue<string>` | `'rgba(0, 0, 0, 0.2)'` | Color of the drop shadow                            |
| `shadowBlur`    | `SignalValue<number>` | `10`                   | Blur radius of the shadow                           |
| `shadowOffsetX` | `SignalValue<number>` | `0`                    | Horizontal offset of the shadow                     |
| `shadowOffsetY` | `SignalValue<number>` | `5`                    | Vertical offset of the shadow                       |

## Examples

### Example 1: Oprah Pointing GIF

```tsx
<TenorGifComponent
  tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
  width={500}
  height={400}
  radius={16}
  shadowColor="rgba(0, 0, 0, 0.3)"
  shadowBlur={15}
  shadowOffsetY={8}
/>
```

### Example 2: Using Just the ID

```tsx
<TenorGifComponent
  tenorId="361299607546324637"
  width={300}
  height={200}
  radius={8}
  shadowColor="rgba(255, 0, 0, 0.2)"
  shadowBlur={5}
/>
```

### Example 3: Animated GIF with Class Component

```tsx
import { TenorGif } from './components/TenorGif';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';

// In your scene:
const gifRef = createRef<TenorGif>();

view.add(
  <TenorGif
    ref={gifRef}
    tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
    width={400}
    height={300}
    radius={12}
    shadowBlur={20}
    shadowColor="rgba(0, 0, 0, 0.4)"
  />,
);

// Animation sequence
yield * gifRef().animateIn(1.2);
yield * waitFor(2);
yield * all(gifRef().width(600, 1), gifRef().height(450, 1));
yield * waitFor(1);
yield * gifRef().animateOut(0.8);
```

## Methods (Class Component Only)

### `animateIn(duration: number = 1)`

Animates the GIF in with fade and scale effects.

### `animateOut(duration: number = 0.5)`

Animates the GIF out with fade and scale effects.

### `updateGif(tenorUrl?: string, tenorId?: string)`

Updates the GIF source dynamically.

```tsx
// Change GIF during animation
yield * gifRef().updateGif('https://tenor.com/view/new-gif-url');
```

## Notes

- The component automatically extracts the Tenor ID from the full URL
- GIFs are loaded directly from Tenor's CDN
- The component handles rounded corners and shadows automatically
- Use the function component for simple static usage
- Use the class component when you need animations and dynamic updates
- Make sure the Tenor URL is accessible and the GIF exists

## Finding Tenor GIF IDs

To get a Tenor GIF ID:

1. Go to tenor.com
2. Find your desired GIF
3. Copy the URL (it ends with the ID)
4. Use either the full URL or just the ID number

Example URL: `https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637`
ID: `361299607546324637`

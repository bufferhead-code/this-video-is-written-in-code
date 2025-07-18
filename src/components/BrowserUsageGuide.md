# Browser Component Usage Guide

The `Browser` component creates a Safari-style browser window for macOS with screenshot functionality using Puppeteer. It can take screenshots of any website and cache them locally.

## Features

✅ **Safari-style macOS browser UI** - Authentic look with traffic lights and navigation bar  
✅ **Real website screenshots** - Uses Puppeteer to capture actual web pages  
✅ **Screenshot caching** - Saves screenshots locally to avoid repeated captures  
✅ **URL navigation** - Change URLs with smooth animations  
✅ **Resize animations** - Animate browser window dimensions  
✅ **Reload functionality** - Refresh and retake screenshots  
✅ **Customizable styling** - Adjust dimensions, scale, and timing  

## Quick Start

```tsx
import {Browser} from '../components/Browser';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const browserRef = createRef<Browser>();
  
  view.add(
    <Browser
      ref={browserRef}
      url="https://www.motion-canvas.io"
      width={1000}
      height={700}
      autoScreenshot={true}
    />
  );
  
  // Wait for screenshot to load
  yield* waitFor(3);
  
  // Navigate to a new URL
  yield* browserRef().navigateToUrl("https://github.com");
});
```

## Properties

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `url` | `string` | `'https://www.google.com'` | Initial URL to load |
| `width` | `number` | `1200` | Browser window width in pixels |
| `height` | `number` | `800` | Browser window height in pixels |
| `scale` | `number` | `1` | Scale factor for the entire browser |

### Screenshot Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `autoScreenshot` | `boolean` | `true` | Take screenshot automatically on initialization |
| `cacheScreenshots` | `boolean` | `true` | Cache screenshots to disk |
| `screenshotDelay` | `number` | `2` | Delay in seconds before taking screenshot |

## Methods

### Navigation Methods

#### `navigateToUrl(newUrl: string)`
Navigate to a new URL with animation.

```tsx
// Navigate with smooth transition
yield* browserRef().navigateToUrl("https://example.com");
```

#### `reload()`
Reload the current page and retake screenshot.

```tsx
// Reload current page
yield* browserRef().reload();
```

### Screenshot Methods

#### `takeScreenshot(): Promise<string>`
Take a screenshot of the current URL (async method).

```tsx
// Take screenshot manually
const screenshotPath = await browserRef().takeScreenshot();
console.log('Screenshot saved to:', screenshotPath);
```

#### `takeScreenshotAnimated()`
Take screenshot with loading animation (generator method).

```tsx
// Take screenshot with fade animation
yield* browserRef().takeScreenshotAnimated();
```

### Animation Methods

#### `animateResize(newWidth: number, newHeight: number, duration: number = 1)`
Animate browser window resize.

```tsx
// Resize browser window
yield* browserRef().animateResize(800, 600, 1.5);
```

### Utility Methods

#### `getCurrentScreenshotPath(): string`
Get the file path of the current screenshot.

```tsx
const currentPath = browserRef().getCurrentScreenshotPath();
```

#### `dispose()`
Clean up resources (closes Puppeteer browser).

```tsx
// Always call dispose when done
browserRef().dispose();
```

## Screenshot Caching

Screenshots are automatically cached in `src/components/media/screenshots/` with sanitized filenames based on the URL:

- `https://www.google.com` → `www_google_com.png`
- `https://github.com/user/repo` → `github_com_user_repo.png`

If `cacheScreenshots` is enabled (default), the component will use cached screenshots instead of retaking them.

## Advanced Usage

### Custom Styling Example

```tsx
<Browser
  url="https://dribbble.com"
  width={1400}
  height={900}
  scale={0.7}
  screenshotDelay={3}
  cacheScreenshots={false} // Always take fresh screenshots
/>
```

### Navigation Sequence

```tsx
export default makeScene2D(function* (view) {
  const browser = createRef<Browser>();
  
  view.add(
    <Browser
      ref={browser}
      url="https://www.motion-canvas.io"
      y={50}
    />
  );
  
  yield* waitFor(3);
  
  // Navigate through multiple sites
  const sites = [
    "https://github.com",
    "https://developer.mozilla.org",
    "https://dribbble.com"
  ];
  
  for (const site of sites) {
    yield* browser().navigateToUrl(site);
    yield* waitFor(3);
  }
  
  // Resize for mobile view
  yield* browser().animateResize(375, 667, 2);
  yield* waitFor(2);
  
  // Back to desktop
  yield* browser().animateResize(1200, 800, 2);
  
  browser().dispose();
});
```

### Performance Optimization

```tsx
// For better performance in long animations
<Browser
  cacheScreenshots={true}  // Use cached screenshots
  screenshotDelay={1}      // Reduce delay
  autoScreenshot={false}   // Manual control
/>
```

## Browser UI Elements

The component creates an authentic Safari-style interface:

- **Traffic Lights**: Red, yellow, green circles (non-functional, visual only)
- **Navigation Bar**: Contains URL bar and reload button
- **URL Bar**: Displays current URL with Safari-style rounded rectangle
- **Content Area**: Shows the actual website screenshot
- **Drop Shadow**: Authentic macOS window shadow

## Error Handling

The component handles various error scenarios:

- **Network timeouts**: 30-second timeout for page loads
- **Invalid URLs**: Gracefully handles malformed URLs
- **Screenshot failures**: Continues operation even if screenshot fails
- **File system errors**: Handles permission issues for screenshot saving

## Requirements

- **Puppeteer**: Automatically downloads Chromium browser
- **File System Access**: Needs write permissions for screenshot caching
- **Network Access**: Required for taking screenshots of external websites

## Troubleshooting

### Common Issues

1. **Screenshots not appearing**: Check network connection and URL validity
2. **Permission errors**: Ensure write access to `media/screenshots/` directory
3. **Timeout errors**: Increase `screenshotDelay` for slow-loading sites
4. **Memory issues**: Call `dispose()` when done to clean up Puppeteer instances

### Debug Tips

```tsx
// Enable debug mode (check console for detailed logs)
const screenshotPath = await browserRef().takeScreenshot();
console.log('Screenshot saved to:', screenshotPath);
```

## Browser Compatibility

The component uses Puppeteer which runs a headless Chromium browser, ensuring consistent rendering across different platforms while maintaining the Safari-style appearance in the UI. 
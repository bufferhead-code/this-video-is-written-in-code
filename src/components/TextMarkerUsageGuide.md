# TextMarker Component for Motion Canvas

A powerful Motion Canvas component that automatically detects text in screenshots and website images using OCR (Optical Character Recognition) and creates beautiful animated marker/highlight effects.

## Features

- 🔍 **Automatic Text Detection** - Uses Tesseract.js OCR to automatically detect text in images
- 🎨 **Multiple Animation Styles** - Marker pen, fade in, typewriter, and pulse animations
- 🌐 **Multi-language Support** - Supports 100+ languages via Tesseract.js
- ⚡ **Configurable** - Extensive customization options for markers and animations
- 🎯 **High Accuracy** - Confidence-based filtering for reliable text detection
- 🔧 **Debug Mode** - Built-in debugging for development

## Installation

The component requires `tesseract.js` for OCR functionality:

```bash
npm install tesseract.js
```

## Basic Usage

```tsx
import {makeScene2D} from '@motion-canvas/2d';
import {TextMarker} from '../components/TextMarker';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const textMarkerRef = createRef<TextMarker>();

  view.add(
    <TextMarker
      ref={textMarkerRef}
      src="/path/to/your/screenshot.png"
      markerColor="#FFEB3B"
      markerOpacity={0.6}
    />
  );

  // Wait for image to load
  yield* waitFor(1);

  // For real OCR detection, call this before the scene starts:
  // await textMarkerRef().detectTextAsync();
  
  // Automatically detect text and create markers (uses mock data if no OCR)
  yield* textMarkerRef().createMarkers();

  // Animate with marker pen effect
  yield* textMarkerRef().animateMarkerPen();
});
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | `''` | Path to the image/screenshot |
| `imageScale` | `number` | `1` | Scale factor for the image |
| `markerColor` | `PossibleColor` | `'#FFEB3B'` | Color of the marker highlights |
| `markerOpacity` | `number` | `0.6` | Opacity of the markers (0-1) |
| `animationDuration` | `number` | `1` | Duration of animations in seconds |
| `markerThickness` | `number` | `4` | Extra padding around detected text |
| `detectLanguage` | `string` | `'eng'` | OCR language code |
| `minConfidence` | `number` | `70` | Minimum confidence for text detection (0-100) |
| `debugMode` | `boolean` | `false` | Enable debug logging |

## Animation Methods

### 1. Marker Pen Animation
Creates a realistic marker pen effect that draws from left to right:

```tsx
yield* textMarkerRef().animateMarkerPen(
  0,    // delay before starting
  0.2   // stagger delay between markers
);
```

### 2. Fade In Animation
Gradually fades in all markers:

```tsx
yield* textMarkerRef().animateFadeIn(
  0,    // delay before starting
  0.1   // stagger delay between markers
);
```

### 3. Typewriter Animation
Appears as if text is being "detected" character by character:

```tsx
yield* textMarkerRef().animateTypewriter(
  0,     // delay before starting
  0.05   // delay per character
);
```

### 4. Pulse Animation
Creates a pulsing highlight effect:

```tsx
yield* textMarkerRef().animatePulse(
  0,  // delay before starting
  3   // number of pulses
);
```

## Two Usage Patterns

### Pattern 1: With Real OCR (Recommended for production)

```tsx
export default makeScene2D(function* (view) {
  const textMarkerRef = createRef<TextMarker>();

  view.add(
    <TextMarker
      ref={textMarkerRef}
      src="/path/to/screenshot.png"
      detectLanguage="eng"
    />
  );

  // IMPORTANT: Do OCR detection before animation starts
  // This should be called outside the generator function
  // await textMarkerRef().detectTextAsync();

  yield* waitFor(1);
  yield* textMarkerRef().createMarkers();
  yield* textMarkerRef().animateMarkerPen();
});
```

### Pattern 2: With Mock Data (Good for development/demo)

```tsx
export default makeScene2D(function* (view) {
  const textMarkerRef = createRef<TextMarker>();

  view.add(
    <TextMarker
      ref={textMarkerRef}
      src="" // Empty src uses mock data
    />
  );

  yield* waitFor(1);
  // This will use predefined mock text areas
  yield* textMarkerRef().createMarkers();
  yield* textMarkerRef().animateMarkerPen();
});
```

## Advanced Usage

### Custom Marker Styling

```tsx
// Change marker style at runtime
textMarkerRef().setMarkerStyle({
  color: '#4CAF50',
  opacity: 0.8,
  thickness: 8
});
```

### Multi-language Support

```tsx
<TextMarker
  src="/chinese-text-screenshot.png"
  detectLanguage="chi_sim"  // Simplified Chinese
  minConfidence={80}
/>
```

### Working with Different Image Sources

```tsx
// Local image
<TextMarker src="/screenshots/website.png" />

// From public folder
<TextMarker src="./public/images/screenshot.jpg" />

// Data URL (for dynamic screenshots)
<TextMarker src="data:image/png;base64,..." />
```

### Complex Animation Sequence

```tsx
export default makeScene2D(function* (view) {
  const marker = createRef<TextMarker>();

  view.add(
    <TextMarker
      ref={marker}
      src="/website-screenshot.png"
      imageScale={0.8}
      debugMode={true}
    />
  );

  yield* waitFor(1);
  yield* marker().createMarkers();

  // Sequence of different animations
  yield* marker().animateMarkerPen(0, 0.3);
  yield* waitFor(1);

  // Change style and animate again
  marker().setMarkerStyle({ color: '#E91E63' });
  marker().clearMarkers();
  yield* marker().createMarkers();
  yield* marker().animateFadeIn(0, 0.1);

  // Cleanup
  marker().dispose();
});
```

## Tips for Best Results

### Image Quality
- Use high-resolution images for better OCR accuracy
- Ensure good contrast between text and background
- Avoid heavily stylized fonts when possible

### Language Detection
- Specify the correct language for better accuracy
- Use `'eng'` for English, `'spa'` for Spanish, etc.
- Check [Tesseract language codes](https://github.com/tesseract-ocr/tesseract/wiki/Data-Files-in-different-versions) for full list

### Performance
- Use `minConfidence` to filter out low-quality detections
- Enable `debugMode` during development to see detection results
- Call `dispose()` when done to free OCR worker resources

### Troubleshooting

#### No text detected?
1. Check if the image path is correct
2. Verify the image has sufficient contrast
3. Try lowering `minConfidence`
4. Enable `debugMode` to see OCR results
5. Check console for error messages

#### Poor detection accuracy?
1. Increase image resolution
2. Try different `detectLanguage` settings
3. Adjust `minConfidence` threshold
4. Preprocess image to improve contrast

## Example: Website Tutorial Highlighting

```tsx
export default makeScene2D(function* (view) {
  const marker = createRef<TextMarker>();

  view.add(
    <TextMarker
      ref={marker}
      src="/tutorial-screenshot.png"
      markerColor="#FF6B35"
      markerOpacity={0.7}
      animationDuration={2}
      minConfidence={75}
    />
  );

  yield* waitFor(1);
  yield* marker().createMarkers();

  // Highlight important elements one by one
  yield* marker().animateMarkerPen(0, 0.5);

  // Get detected text for additional processing
  const detectedTexts = marker().getDetectedTexts();
  console.log('Found text elements:', detectedTexts);
});
```

This component is perfect for creating educational content, tutorials, or any video that needs to highlight text in website screenshots! 
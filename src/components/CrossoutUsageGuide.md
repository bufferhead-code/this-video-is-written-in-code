# Crossout Component Usage Guide

The `Crossout` component creates an animated red strike-through line that draws from left to right, with optional red text that can appear above or below the line. Perfect for crossing out content or creating dramatic "cancelled" effects in videos.

## Basic Usage

```tsx
import { Crossout } from '../components/Crossout';

// Basic crossout line only
<Crossout
  width={400}
  position={[0, 0]}
/>

// Crossout with text below (default)
<Crossout
  width={400}
  text="CANCELLED"
  position={[0, 0]}
/>

// Crossout with text above
<Crossout
  width={400}
  text="CANCELLED"
  textPosition="above"
  position={[0, 0]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `SignalValue<number>` | `300` | Width of the crossout line |
| `strokeColor` | `SignalValue<PossibleColor>` | `'#ff0000'` | Color of the crossout line |
| `strokeWidth` | `SignalValue<number>` | `4` | Thickness of the crossout line |
| `text` | `SignalValue<string>` | `''` | Optional text to display above or below |
| `textSize` | `SignalValue<number>` | `48` | Font size of the text |
| `textOffset` | `SignalValue<number>` | `40` | Vertical offset of text from the line |
| `textPosition` | `SignalValue<'above' \| 'below'>` | `'below'` | Position text above or below the line |
| `animationDuration` | `SignalValue<number>` | `0.8` | Duration of animations in seconds |

## Animation Methods

### `animateCrossout(delay?: number)`
Animates just the strike-through line from left to right.

```tsx
const crossout = createRef<Crossout>();

yield* crossout().animateCrossout(0.5); // Start after 0.5 seconds
```

### `animateText(delay?: number)`
Animates just the text appearing above or below the line (if text is provided).

```tsx
yield* crossout().animateText(0.2); // Start text after 0.2 seconds
```

### `animateComplete(lineDelay?: number, textDelay?: number)`
Animates the crossout line first, then the text. Default text delay is 0.2 seconds after the line completes.

```tsx
yield* crossout().animateComplete(); // Line immediately, text after line + 0.2s
yield* crossout().animateComplete(1.0, 0.5); // Line after 1s, text 0.5s after line completes
```

### `animateSimultaneous(delay?: number)`
Animates both the line and text at the same time (text starts slightly after line).

```tsx
yield* crossout().animateSimultaneous(0.5); // Both start after 0.5 seconds
```

## Utility Methods

### `updateText(newText: string)`
Dynamically updates the text content.

```tsx
crossout().updateText("NEW TEXT");
```

### `reset()`
Resets the component to its initial state (invisible line and text).

```tsx
crossout().reset();
```

### `setCrossoutStyle(properties)`
Updates multiple style properties at once.

```tsx
crossout().setCrossoutStyle({
  color: '#ff6b6b',
  width: 500,
  strokeWidth: 6,
  textSize: 64,
  textOffset: 50,
  textPosition: 'above'
});
```

## Complete Scene Example

```tsx
import { makeScene2D } from '@motion-canvas/2d';
import { Crossout } from '../components/Crossout';
import { waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const crossout = createRef<Crossout>();

  view.add(
    <Crossout
      ref={crossout}
      width={600}
      text="ADOBE PREMIERE PRO"
      textPosition="below"
      strokeColor="#ff0000"
      strokeWidth={8}
      textSize={56}
      position={[0, 0]}
    />
  );

  // Wait a moment, then animate the crossout
  yield* waitFor(1);
  yield* crossout().animateComplete();
  
  // Wait and reset for another animation
  yield* waitFor(2);
  crossout().reset();
  crossout().updateText("EXPENSIVE SOFTWARE");
  yield* crossout().animateSimultaneous();
});
```

## Styling Tips

- **Line Width**: Use `width` prop to match the content you're crossing out
- **Stroke Width**: Thicker lines (6-10px) work well for dramatic effect
- **Colors**: While red is default, you can use any color with `strokeColor`
- **Text Positioning**: Use `textPosition="above"` or `textPosition="below"` to position text, and adjust `textOffset` for spacing from the line
- **Animation Timing**: Use `animationDuration` to match the pacing of your scene

## Use Cases

1. **Crossing out logos or brand names**
2. **"Cancelled" or "Rejected" text effects**
3. **Price strikethroughs in comparison scenes**
4. **Dramatic rejection of ideas or concepts**
5. **Overlay on screenshots or images to show what's being eliminated**

## Performance Notes

- The component uses Motion Canvas 2D Line component for optimal performance
- Text rendering uses the existing `StyledText` component for consistency
- Animation uses efficient tweening for smooth line drawing
- Component can be easily reset and reused within the same scene
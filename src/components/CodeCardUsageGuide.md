# CodeCard Component Usage Guide

The `CodeCard` component is a styled container for displaying code with syntax highlighting and includes built-in highlight functions for animating text selection.

## Basic Usage

```tsx
import { CodeCard, CodeCardInstance } from '../components/CodeCard';

// Create a CodeCard instance
const codeCard = (
  <CodeCard
    code={`const radius = createSignal(3);
const area = createSignal(
  () => Math.PI * radius() * radius()
);`}
    layoutDirection="row"
    width={900}
    height={500}
  />
) as CodeCardInstance;
```

## Highlight Functions

The `CodeCard` component includes two methods for managing text selection animations.

### highlight()
Animates selection of specific text in the code.

#### Syntax
```tsx
yield* codeCard.highlight(text: string, duration?: number);
```

#### Parameters
- `text` (string): The text to highlight in the code
- `duration` (number, optional): Animation duration in seconds (default: 0.5)

### resetHighlight()
Clears any current text selection using Motion Canvas's DEFAULT selection.

#### Syntax
```tsx
yield* codeCard.resetHighlight(duration?: number);
```

#### Parameters
- `duration` (number, optional): Animation duration in seconds (default: 0.5)

### Example Usage

```tsx
// Highlight specific text in the code
yield* codeCard.highlight('createSignal(3)', 0.5);
yield* waitFor(1);

// Highlight another part of the code
yield* codeCard.highlight('Math.PI', 0.3);
yield* waitFor(1);

// Clear the selection
yield* codeCard.resetHighlight(0.5);
yield* waitFor(1);
```

## Props

The `CodeCard` component accepts all standard `Rect` props plus:

- `code` (string): The code text to display
- `codeRef` (optional): A ref to the Code component
- `codeProps` (optional): Additional props to pass to the Code component
- `preview` (optional): A preview component to display alongside the code
- `layoutDirection` ('row' | 'column'): Layout direction for code and preview (default: 'row')
- `children` (optional): Additional child components

## Styling

The component comes with a dark theme by default:
- Background: `#23272e`
- Border: `#353b45`
- Text: `#d4d4d4`
- Font: Fira Code (fallback to Consolas, monospace)
- Font size: 32px
- Border radius: 18px
- Shadow: Subtle drop shadow

## Complete Example

```tsx
import { makeScene2D } from '@motion-canvas/2d';
import { waitFor } from '@motion-canvas/core';
import { CodeCard, CodeCardInstance } from '../components/CodeCard';

export default makeScene2D(function* (view) {
  const codeText = `function calculateArea(radius) {
  return Math.PI * radius * radius;
}

const result = calculateArea(5);
console.log(result);`;

  const codeCard = (
    <CodeCard
      code={codeText}
      layoutDirection="column"
      width={800}
      height={400}
    />
  ) as CodeCardInstance;

  view.add(codeCard);

  // Animate highlighting different parts of the code
  yield* codeCard.highlight('function calculateArea', 0.5);
  yield* waitFor(1);
  
  yield* codeCard.highlight('Math.PI', 0.3);
  yield* waitFor(1);
  
  yield* codeCard.highlight('calculateArea(5)', 0.4);
  yield* waitFor(1);

  // Clear all selections
  yield* codeCard.resetHighlight(0.5);
  yield* waitFor(1);
});
``` 
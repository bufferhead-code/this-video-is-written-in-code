# DynamicColumnLayout Usage Guide

The `DynamicColumnLayout` component provides a flexible column layout system with smooth animations for adding, inserting, and removing elements. It supports sophisticated gap animations that create a professional, fluid user experience.

## Basic Usage

```typescript
import { DynamicColumnLayout } from './components/DynamicColumnLayout';
import { Rect } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';

// Create the layout
const layout = new DynamicColumnLayout({
  itemGap: 20,
  animationDuration: 0.4,
  width: 800,
  height: 200,
});

// Create elements to add
const element1 = new Rect({
  width: 100,
  height: 150,
  fill: '#ff6b6b',
  radius: 8,
});

const element2 = new Rect({
  width: 120,
  height: 150,
  fill: '#4ecdc4',
  radius: 8,
});

// Add elements with animation
yield* layout.addItem(element1, 100);
yield* layout.addItem(element2, 120);
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `itemGap` | `SignalValue<number>` | `20` | Space between columns |
| `animationDuration` | `SignalValue<number>` | `0.4` | Duration of animations in seconds |

## Methods

### `addItem(node: Rect, targetWidth: number = 100)`

Adds an element to the end of the layout with smooth animation.

**Animation sequence:**
1. Animates left margin of the first element to create gap space
2. Adds element with 0 width and 0 opacity
3. Removes the margin from the first element
4. Animates element width to target width
5. Fades in the element

```typescript
const newElement = new Rect({
  height: 150,
  fill: '#ff9f43',
  radius: 8,
});

yield* layout.addItem(newElement, 150);
```

### `insertItem(node: Rect, index: number, targetWidth: number = 100)`

Inserts an element at a specific index with smooth animation.

**Animation sequence:**
1. Animates margins of adjacent elements to create gap space
2. Adds element with 0 width and 0 opacity at the specified index
3. Removes the margins from adjacent elements
4. Animates element width to target width
5. Fades in the element

```typescript
const insertElement = new Rect({
  height: 150,
  fill: '#a55eea',
  radius: 8,
});

// Insert at index 1 (between first and second elements)
yield* layout.insertItem(insertElement, 1, 130);
```

### `removeByRef(nodeToRemove: Reference<Rect>)`

Removes an element from the layout with smooth animation.

**Animation sequence:**
1. Fades out the element
2. Animates element width to 0
3. Handles gap animation based on position:
   - **First element**: Animates left margin of next element
   - **Last element**: Animates right margin of previous element
   - **Middle element**: Animates margins of both adjacent elements
4. Removes element from layout

```typescript
import { createRef } from '@motion-canvas/core/lib/utils';

const elementRef = createRef<Rect>();
const element = new Rect({
  ref: elementRef,
  height: 150,
  fill: '#ff6b6b',
  radius: 8,
});

yield* layout.addItem(element, 100);
// Later...
yield* layout.removeByRef(elementRef);
```

### `clear()`

Removes all elements from the layout simultaneously.

```typescript
yield* layout.clear();
```

### Utility Methods

#### `getItems(): ColumnItem[]`

Returns a copy of all items in the layout.

```typescript
const items = layout.getItems();
console.log(`Layout has ${items.length} items`);
```

#### `getItemCount(): number`

Returns the number of items in the layout.

```typescript
const count = layout.getItemCount();
```

## Advanced Usage

### Custom Animation Timing

```typescript
const layout = new DynamicColumnLayout({
  gap: 30,
  animationDuration: 0.6, // Slower animations
  width: 1000,
  height: 300,
});
```

### Dynamic Gap Changes

```typescript
// Change gap during runtime
yield* layout.itemGap(40, 0.5); // Animate gap to 40px over 0.5 seconds
```

### Staggered Element Addition

```typescript
const elements = [
  new Rect({ height: 150, fill: '#ff6b6b', radius: 8 }),
  new Rect({ height: 150, fill: '#4ecdc4', radius: 8 }),
  new Rect({ height: 150, fill: '#ff9f43', radius: 8 }),
];

// Add elements with staggered timing
for (let i = 0; i < elements.length; i++) {
  yield* layout.addItem(elements[i], 100 + i * 20);
  yield* waitFor(0.2); // Wait between additions
}
```

### Complex Layout Manipulation

```typescript
// Create a more complex sequence
const layout = new DynamicColumnLayout({
  itemGap: 20,
  animationDuration: 0.3,
  width: 800,
  height: 200,
});

// Add initial elements
yield* layout.addItem(element1, 100);
yield* layout.addItem(element2, 120);
yield* layout.addItem(element3, 110);

// Insert in the middle
yield* layout.insertItem(newElement, 1, 130);

// Remove the last element
yield* layout.removeByRef(element3Ref);

// Clear everything
yield* layout.clear();
```

## Best Practices

1. **Use consistent target widths** for visual harmony
2. **Avoid rapid successive operations** - the component handles queuing internally
3. **Store element references** when you plan to remove them later
4. **Choose appropriate animation durations** based on your content (0.3-0.6s recommended)
5. **Test with different gap values** to find the best spacing for your design

## Performance Notes

- The component prevents overlapping animations by queuing operations
- Animation state is tracked internally to ensure smooth transitions
- Gap animations use optimized margin adjustments instead of full layout recalculations
- All timing functions use Motion Canvas's optimized easing functions

## Examples

See the component in action in various Motion Canvas scenes for real-world usage patterns.
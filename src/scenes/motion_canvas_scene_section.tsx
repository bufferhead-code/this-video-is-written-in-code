import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { View2D, Layout, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { ElementCard } from '../components/ElementCard';
import { all, waitFor, waitUntil, fadeTransition } from '@motion-canvas/core';
import { fadeIn, zoomIn } from '../animation';
import { CodeCard } from '../components/CodeCard';

export default makeScene2D(function* (view) {
  // Add gray background
  view.add(
    <Rect width={"100%"} height={"100%"} fill="#1d1d1f" />
  );

  yield* fadeTransition(1);

  // Motion Canvas elements to display
  const elements = [
    'Bezier', 'Camera', 'Circle', 'Code', 'CubicBezier', 'Curve', 'Grid', 'Icon', 'Img', 'Knot', 'Latex', 'Layout', 'Line', 'Node', 'Path', 'Polygon', 'QuadBezier', 'Ray', 'Rect', 'SVG', 'Shape', 'Spline', 'Txt', 'Video', 'View2D'
  ];

  // Create a grid layout container
  const gridLayout = new Layout({
    width: '100%',
    height: 800,
    layout: true,
    direction: 'row',
    wrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 30,
  });

  // Create cards for each element
  const cards: ElementCard[] = [];
  elements.forEach((elementName, index) => {
    const card = new ElementCard({
      elementName,
      opacity: 0,
    });
    cards.push(card);
    gridLayout.add(card);
  });

  // Add layout to view
  view.add(gridLayout);

  // Animate cards appearing with staggered, overlapping effect
  const staggerDelay = 0.1; // Shorter delay for more overlap
  const animationDuration = 0.4;
  
  // Start multiple animations simultaneously with staggered delays
  const animations = cards.map((card, index) => 
    fadeIn(card, { duration: animationDuration, delay: index * staggerDelay })
  );
  
  // Run all animations concurrently
  yield* all(...animations);

  // Wait at the end
  yield* waitUntil('show_code_example');


  const codeExample = CodeCard({
    code: `view.add(\n    <Code\n      fontSize={28}\n      code={'const number = 7;'}\n    />,\n  );`,
    layoutDirection: 'column',
    opacity: 0,
    
  });


  // blur background
  const blurBackground = new Rect({
    width: "100%",
    height: "100%",
    fill: "rgba(0, 0, 0, 0.7)",
    opacity: 0,
  });

  view.add(
    blurBackground
  );

  view.add(codeExample);

  yield* all(
    zoomIn(codeExample, { duration: 0.4, toScale: 1.5 }),
    blurBackground.opacity(1, 0.4),
  ) 

  yield* waitUntil('scene_end');
});
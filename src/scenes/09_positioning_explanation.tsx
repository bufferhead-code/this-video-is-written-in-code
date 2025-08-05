import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { createSignal, fadeTransition } from '@motion-canvas/core';
import { Rect, Circle, Txt, Line, Code } from '@motion-canvas/2d/lib/components';
import { CodeCard } from '../components/CodeCard';
import { Background } from '../components/Background';
import { Vector2 } from '@motion-canvas/core';
import { zoomIn, fadeIn, fadeOut } from '../animation';

export default makeScene2D(function* (view) {
  const sceneCardRef = createRef<Rect>();
  const centerCircleRef = createRef<Circle>();
  const codeCardRef = createRef<Rect>();
  const codeRef = createRef<Code>();
  
  // Distance indicators
  const topArrowRef = createRef<Line>();
  const rightArrowRef = createRef<Line>();
  const bottomArrowRef = createRef<Line>();
  const leftArrowRef = createRef<Line>();
  
  // Coordinate system arrows
  const xAxisArrowRef = createRef<Line>();
  const yAxisArrowRef = createRef<Line>();
  const xLabelRef = createRef<Txt>();
  const yLabelRef = createRef<Txt>();
  
  // Coordinate values
  const xValue = createSignal(0);
  const yValue = createSignal(0);

  // Background
  view.add(<Background />);

  yield* fadeTransition(1);

  // Scene Card (representing a Motion Canvas scene)
  view.add(
    <Rect
      ref={sceneCardRef}
      width={1000}
      height={800}
      radius={18}
      fill={'#23272e'}
      stroke={'#353b45'}
      lineWidth={2}
      shadowBlur={24}
      shadowColor={'rgba(0, 0, 0, 0.10)'}
      shadowOffsetY={10}
      scale={0}
    />
  );

  // Center circle
  view.add(
    <Circle
      ref={centerCircleRef}
      size={60}
      fill={'#ff6b6b'}
      x={xValue}
      y={yValue}
      scale={0}
    />
  );

  // Distance arrows and labels
  // Top arrow
  view.add(
    <Line
      ref={topArrowRef}
      stroke={'#4ecdc4'}
      lineWidth={3}
      startArrow
      endArrow
      arrowSize={8}
      points={[
        [0, -400], // top of card
        [0, -30]   // top of circle
      ]}
      opacity={0}
    />
  );
  


  // Right arrow
  view.add(
    <Line
      ref={rightArrowRef}
      stroke={'#4ecdc4'}
      lineWidth={3}
      startArrow
      endArrow
      arrowSize={8}
      points={[
        [30, 0],   // right of circle
        [500, 0]   // right of card
      ]}
      opacity={0}
    />
  );
  


  // Bottom arrow
  view.add(
    <Line
      ref={bottomArrowRef}
      stroke={'#4ecdc4'}
      lineWidth={3}
      startArrow
      endArrow
      arrowSize={8}
      points={[
        [0, 30],   // bottom of circle
        [0, 400]   // bottom of card
      ]}
      opacity={0}
    />
  );
  


  // Left arrow
  view.add(
    <Line
      ref={leftArrowRef}
      stroke={'#4ecdc4'}
      lineWidth={3}
      startArrow
      endArrow
      arrowSize={8}
      points={[
        [-500, 0], // left of card
        [-30, 0]   // left of circle
      ]}
      opacity={0}
    />
  );
  


  // Coordinate system arrows (will appear later)
  // X-axis arrow (pointing right)
  view.add(
    <Line
      ref={xAxisArrowRef}
      stroke={'#ff4757'}
      lineWidth={4}
      endArrow
      arrowSize={12}
      points={[
        [0, 0],
        [150, 0]
      ]}
      opacity={0}
    />
  );

  // Y-axis arrow (pointing down)
  view.add(
    <Line
      ref={yAxisArrowRef}
      stroke={'#2ed573'}
      lineWidth={4}
      endArrow
      arrowSize={12}
      points={[
        [0, 0],
        [0, 150]
      ]}
      opacity={0}
    />
  );

  // Axis labels
  view.add(
    <Txt
      ref={xLabelRef}
      text="X"
      fontSize={32}
      fill={'#ff4757'}
      fontWeight={700}
      position={[180, 0]}
      opacity={0}
    />
  );

  view.add(
    <Txt
      ref={yLabelRef}
      text="Y"
      fontSize={32}
      fill={'#2ed573'}
      fontWeight={700}
      position={[0, 180]}
      opacity={0}
    />
  );

  // Code card showing coordinates
  view.add(
    <CodeCard
      ref={codeCardRef}
      code={`<Circle>`}
      codeRef={codeRef}
      position={[0, -150]}
      scale={1.2}
      opacity={0}
    />
  );

  // Animation sequence
  
  // 1. Show scene card
  yield* zoomIn(sceneCardRef(), {
    duration: 1,
    fromScale: 0,
    toScale: 1,
  });

  yield* waitUntil('show_center_circle');

  // 2. Show center circle
  yield* zoomIn(centerCircleRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1,
  });

  yield* waitUntil('show_distance_arrows');

  // 3. Show distance indicators
  yield* fadeIn(topArrowRef(), { duration: 0.6 });

  yield* waitUntil('right_arrow');

  yield* fadeIn(rightArrowRef(), { duration: 0.6 });

  yield* waitUntil('bottom_arrow');

  yield* fadeIn(bottomArrowRef(), { duration: 0.6 });

  yield* waitUntil('left_arrow');

  yield* fadeIn(leftArrowRef(), { duration: 0.6 });

  yield* waitUntil('fade_distance_arrows');

  // 4. Fade out distance indicators
  yield* all(
    fadeOut(topArrowRef(), { duration: 0.5 }),
    fadeOut(rightArrowRef(), { duration: 0.5 }),
    fadeOut(bottomArrowRef(), { duration: 0.5 }),
    fadeOut(leftArrowRef(), { duration: 0.5 }),
  );

  yield* waitUntil('show_coordinates');

  // 5. Show coordinate system
  yield* all(
    fadeIn(xAxisArrowRef(), { duration: 0.8 }),
    fadeIn(xLabelRef(), { duration: 0.8 }),
  );

  yield* waitUntil('show_y_axis');

  yield* all(
    fadeIn(yAxisArrowRef(), { duration: 0.8 }),
    fadeIn(yLabelRef(), { duration: 0.8 }),
  );

  yield* waitUntil('show_code_card');

  // 6. Show code card
  yield* fadeIn(codeCardRef(), { duration: 0.8 });

  yield* waitUntil('animate_x_value');

  // 6.5. Animate code to show x and y props with synchronized circle movement
  yield* all(
    codeRef().code.insert([0, 7], 0.8)` x={100}`,
    xValue(100, 0.8),
  );
  
  yield* waitUntil('animate_y_value');
  
  yield* all(
    codeRef().code.insert([0, 15], 0.8)` y={100}`,
    yValue(100, 0.8),
  );

  yield* waitUntil('scene_end');
});
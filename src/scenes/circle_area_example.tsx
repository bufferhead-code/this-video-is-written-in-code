import {Circle, Line, Txt, Rect, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createSignal, waitFor, waitUntil} from '@motion-canvas/core';
import {COLORS} from '../utils/colors';
import {CodeCard, CodeCardInstance} from '../components/CodeCard';
import {DynamicColumnLayout} from '../components/DynamicColumnLayout';

export default makeScene2D(function* (view) {
  const radius = createSignal(3);
  const area = createSignal(() => Math.PI * radius() * radius());

  const scale = 100;
  const textStyle = {
    fontWeight: 700,
    fontSize: 56,
    offsetY: -1,
    padding: 20,
    cache: true,
  };

  view.fill(COLORS.grayBg);

  // Code for the circle area calculation
  const codeText = `const radius = createSignal(3);
const area = createSignal(
  () => Math.PI * radius() * radius()
);

...

yield* radius(4, 2).to(3, 2);`;

  // Create preview visualization
  const previewContent = (
    <Rect
      width={500}
      height={1200}
      fill={COLORS.grayBgCard}
      stroke={COLORS.grayCardBorder}
      lineWidth={2}
      shadowColor={'rgba(0, 0, 0, 0.3)'}
      shadowOffset={[0, 4]}
      layout={false}
      
    >
      {/* Circle visualization */}
      <Circle
        width={() => radius() * scale * 0.8}
        height={() => radius() * scale * 0.8}
        fill={'#e13238'}
      />
      
      {/* Radius line */}
      <Line
        points={[
          () => Vector2.left.scale(radius() * scale/2 - 50),
          () => Vector2.right.scale(radius() * scale/2 - 50),
        ]}
        lineDash={[20, 20]}
        startArrow
        endArrow
        endOffset={8}
        lineWidth={8}
        stroke={'#ffffff'}
      />
      
      {/* Radius label */}
      <Txt
        text={() => `r = ${radius().toFixed(2)}`}
        y={170}
        fill={'#ffffff'}
        {...textStyle}
      />
      
      {/* Area label */}
      <Txt
        text={() => `A = ${area().toFixed(2)}`}
        y={240}
        fill={'#e13238'}
        {...textStyle}
      />
    </Rect>
  );

  // Create wrapping Rect for preview
  const preview = (
    <Rect
      width={400}
      height={400}
    >
      {previewContent}
    </Rect>
  ) as Rect;

  // Create the layout container
  const layout = (
    <DynamicColumnLayout
      itemGap={100}
      animationDuration={0.6}
    />
  ) as DynamicColumnLayout;

  view.add(layout);

  // Create the components
  const codeCard = (
    <CodeCard
      code={codeText}
      layoutDirection="row"
      width={900}
      height={500}
    />
  ) as CodeCardInstance;

  // Add items to the layout with animations
  yield* layout.addItem(codeCard, 900);

  // highlight createSignal(3) on the code card, selection
  yield* codeCard.highlight('createSignal(3)', 0.5);
  yield* waitUntil('clear_highlight');

  // Clear the selection
  yield* codeCard.resetHighlight(0.5);
  yield* waitUntil('highlight_area');

  // highlight area variable definition
  yield* codeCard.highlight('const area = createSignal(\n  () => Math.PI * radius() * radius()\n);', 0.5);
  yield* waitUntil('clear_area_highlight');

  // Clear the selection
  yield* codeCard.resetHighlight(0.5);
  yield* waitUntil('add_preview');

  yield* layout.addItem(preview, 500);
  // Clear the selection
  yield* waitUntil('animate_radius');

  yield* all(
    codeCard.highlight('yield* radius(4, 2).to(3, 2);', 0.5),
    radius(4, 2).to(3, 2)
  );
  yield* waitUntil('reset_final_highlight');
  yield* codeCard.resetHighlight(0.5);
  yield* waitUntil('end');

});
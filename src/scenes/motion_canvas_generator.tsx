import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition, createSignal, DEFAULT } from '@motion-canvas/core';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Code, Video, Txt } from '@motion-canvas/2d/lib/components';
import { blur } from '@motion-canvas/2d';
import { slideInLeft, slideInRight, slideInBottom, zoomIn } from '../animation';
import { Background } from '../components/Background';
import { BlueprintBackground } from '../components/BlueprintBackground';
import { COLORS } from '../utils/colors';
import motionCanvasLogo from '../images/motion-canvas-logo.svg';
import remotionLogo from '../components/media/remotion-logo.svg';
import { Logo } from '../components/Logo';
import { MEME_STYLE } from '../components/MemeStyle';
import myBrainMessVideo from '../images/my_brain_mess.mp4';
import { Layout } from '@motion-canvas/2d/lib/components';
import { CodeCard } from '../components/CodeCard';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';

export default makeScene2D(function* (view) {
  // --- LOGO REFS ---
  const motionCanvasLogoRef = createRef<Logo>();
  const remotionLogoRef = createRef<Logo>();
  // --- EXISTING REFS ---
  const codeContainerRef = createRef<Rect>();
  const codeRef = createRef<Code>();
  const rectRef = createRef<Rect>();
  // --- NEW REFS FOR CODECARDS AND PREVIEWS ---
  const mcCodeRef = createRef<Code>();
  const mcPreviewRectRef = createRef<Rect>();
  const remotionCodeRef = createRef<Code>();
  const remotionPreviewRectRef = createRef<Rect>();
  const remotionReactCodeRef = createRef<Code>();
  const mcShowcaseLayoutRef = createRef<Layout>();
  const showcaseLayoutRef = createRef<DynamicColumnLayout>();
  const logoLayoutRef = createRef<Layout>();
  const memeVideoRef = createRef<any>();
  const remotionFullCodeRef = createRef<Code>();
  const remotionPreviewLayoutRef = createRef<Layout>();
  // Selection signal for Remotion code block highlighting
  const selection = createSignal([]);
  const codeExample = `export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  
  view.add(<Rect ref={rect} width={100} height={100} fill="#e13238" />);
  
  yield* rect().position.x(300, 1);
  yield* waitFor(1);
  yield* rect().position.x(-300, 1);
});`;

  const remotionReactCode = `import {useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import React from 'react';

export const MoveRightAndBack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Duration params in frames
  const moveDuration = fps; // 1 second to move right
  const waitDuration = fps; // 1 second wait
  const totalDuration = moveDuration * 2 + waitDuration; // move right + wait + move left

  // Calculate progress based on frame number modulo totalDuration
  const frameInCycle = frame % totalDuration;

  let x = 0;

  if (frameInCycle < moveDuration) {
    // Move right over moveDuration frames (ease in-out)
    x = interpolate(
      frameInCycle,
      [0, moveDuration - 1],
      [0, 300],
      {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
    );
  } else if (frameInCycle < moveDuration + waitDuration) {
    // Stay at 300px
    x = 300;
  } else {
    // Move back left over moveDuration frames
    x = interpolate(
      frameInCycle,
      [moveDuration + waitDuration, totalDuration - 1],
      [300, 0],
      {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
    );
  }

  return (
    <div
      style={{
        width: 100,
        height: 100,
        backgroundColor: 'tomato',
        transform: \`translateX(\${x}px)\`,
      }}
    />
  );
};`;

  // --- LOGO ELEMENTS ---
  view.add(
    <>
      {/* Fullscreen blueprint background */}
      <Rect width={'100%'} height={'100%'} zIndex={-100}>
        <BlueprintBackground width={'100%'} height={'100%'} />
      </Rect>
      {/* Logos in a horizontal layout */}
      <Layout
        layout
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={60}
        ref={logoLayoutRef}
        zIndex={100}
      >
        <Logo
          ref={remotionLogoRef}
          src={remotionLogo}
          containerSize={400}
          zIndex={100}
          opacity={0}
          scale={0}
        />
        <Logo
          ref={motionCanvasLogoRef}
          src={motionCanvasLogo}
          containerSize={400}
          zIndex={100}
          opacity={0}
          scale={0}
        />
      </Layout>
      {/* --- MOTION CANVAS SHOWCASE --- */}
      <Layout
        ref={mcShowcaseLayoutRef}
        layout
        direction={'row'}
        alignItems={'end'}
        justifyContent={'center'}
        gap={60}
        y={60}
        opacity={0}
      >
        <CodeCard
          code={`export const MyComposition = () => {\n  const frame = useCurrentFrame();\n \n  return (\n    <AbsoluteFill\n        style={{ ...\n         transform: \`translateX(\${frame}px)\` \n         }}\n      />\n\n  );\n};`}
          codeRef={mcCodeRef}
          width={1000}
          height={500}
        />
        <Layout direction={'column'} alignItems={'center'} gap={16}>
          <Txt
            fill={'#d4d4d4'}
            fontSize={28}
            fontFamily={'Fira Code, Consolas, monospace'}
            layout={false}
            position={[10, 10]}
          >
            Preview
          </Txt>
          <Rect
            stroke={COLORS.grayCardBorder}
            lineWidth={5}
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            radius={12}
            width={600}
            height={500}
            gap={16}
            clip
          >
            <Rect
              ref={mcPreviewRectRef}
              width={200}
              height={200}
              layout={false}
              fill={'#ff6b6b'}
              radius={10}
              opacity={0}
              stroke={'#888'}
              lineWidth={3}
            />
          </Rect>
        </Layout>
      </Layout>
      {/* --- REMOTION SHOWCASE --- */}
      <DynamicColumnLayout
        ref={showcaseLayoutRef}
        layout
        direction={'row'}
        alignItems={'start'}
        justifyContent={'center'}
        gap={60}
        height={500}
        y={100}
        opacity={0}
      />

      {/* Meme video blur overlay */}
      <Video
        ref={memeVideoRef}
        src={myBrainMessVideo}
        opacity={0}
        scale={0.8}
        zIndex={200}
        height={900}
        loop
        play
        {...MEME_STYLE}
      />
      {/* Meme video with meme style */}
    </>,
  );

  // --- ANIMATION SEQUENCE ---
  yield* fadeTransition(1);

  // 1. Scale in both logos
  yield* all(zoomIn(motionCanvasLogoRef()), zoomIn(remotionLogoRef()));
  yield* waitFor(1.0);

  // 2. Immediately scale both logos down to the top, make MC transparent
  yield* all(
    logoLayoutRef().scale(0.4, 0.6),
    logoLayoutRef().y(-350, 0.6),
    logoLayoutRef().gap(100, 0.6),
  );
  yield* waitFor(0.2);
  // make motion canvas logo transparent
  yield* all(
    motionCanvasLogoRef().opacity(0.5, 0.6),
    motionCanvasLogoRef().filters.grayscale(1, 0.6),
  );
  yield* waitFor(0.2);

  // 3. Slide in MC CodeCard and Preview
  yield* mcShowcaseLayoutRef().opacity(1, 1.0);
  yield* all(mcPreviewRectRef().opacity(1, 0.5));
  yield* waitFor(1.5);

  // 4. Animate the preview rectangle
  const frameRange = mcCodeRef().findFirstRange(
    'const frame = useCurrentFrame();',
  );
  mcCodeRef().selection(frameRange);
  yield* waitFor(1.0);
  mcCodeRef().selection(DEFAULT);
  yield* waitFor(0.5);
  yield* waitFor(1.0);

  const transformRange = mcCodeRef().findFirstRange(
    'transform: `translateX(${frame}px)`',
  );
  mcCodeRef().selection(transformRange);
  yield* waitFor(0.5);
  yield* mcPreviewRectRef().x(1200, 2.0);
  yield* waitFor(1.0);
  // 6. Show the meme video with zoomIn effect
  yield* all(
    zoomIn(memeVideoRef()),
    mcShowcaseLayoutRef().filters.blur(10, 0.5),
  );
  yield* waitFor(1.0);

  // Fade out MC showcase
  yield* all(
    mcShowcaseLayoutRef().opacity(0, 0.8),
    mcPreviewRectRef().opacity(0, 0.8),
    memeVideoRef().opacity(0, 0.8),
    mcShowcaseLayoutRef().filters.blur(0, 0.8),
  );
  yield* waitFor(0.2);

  // Scale logos back to center
  yield* all(
    logoLayoutRef().scale(1, 0.6),
    logoLayoutRef().y(0, 0.6),
    logoLayoutRef().gap(60, 0.6),
  );
  yield* waitFor(0.2);
  // Switch opacity/grayscale to indicate Remotion
  yield* all(
    motionCanvasLogoRef().opacity(1, 0.6),
    motionCanvasLogoRef().filters.grayscale(0, 0.6),
    remotionLogoRef().opacity(0.5, 0.6),
    remotionLogoRef().filters.grayscale(1, 0.6),
  );
  yield* waitFor(0.2);
  // Scale logos back to top
  yield* all(
    logoLayoutRef().scale(0.4, 0.6),
    logoLayoutRef().y(-400, 0.6),
    logoLayoutRef().gap(100, 0.6),
  );
  yield* waitFor(0.2);

  // Slide in Remotion CodeCard and Preview
  yield* showcaseLayoutRef().opacity(1, 1.0);
  yield* waitFor(0.5);

  // Create Remotion React CodeCard as Rect
  const remotionReactCard = new Rect({
    radius: 18,
    padding: 36,
    shadowBlur: 24,
    lineWidth: 2,
    fill: '#23272e',
    stroke: '#353b45',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffsetY: 10,
    layout: true,
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    width: 800,
    height: 500,
    opacity: 0,
  });

  const remotionReactCodeElement = new Code({
    code: remotionReactCode,
    fontSize: 8,
    fontFamily: 'Fira Code, Consolas, monospace',
    fill: '#d4d4d4',
    offsetX: -1,
    offsetY: -1,
  });

  remotionReactCard.add(remotionReactCodeElement);

  // Create Motion Canvas CodeCard as Rect
  const motionCanvasCodeCard = new Rect({
    radius: 18,
    padding: 36,
    shadowBlur: 24,
    lineWidth: 2,
    fill: '#23272e',
    stroke: '#353b45',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffsetY: 10,
    layout: true,
    direction: 'row',
    gap: 60,
    width: 1000,
    height: 500,
  });

  const motionCanvasCodeElement = new Code({
    code: `export default makeScene2D(function* (view) {\n  const rect = createRef<Rect>();\n  \n  view.add(<Rect ref={rect} width={100} height={100} fill=\"#e13238\" />);\n  \n  yield* rect().position.x(300, 1);\n  yield* waitFor(1);\n  yield* rect().position.x(-300, 1);\n});`,
    fontSize: 32,
    fontFamily: 'Fira Code, Consolas, monospace',
    fill: '#d4d4d4',
    offsetX: -1,
    offsetY: -1,
  });

  motionCanvasCodeCard.add(motionCanvasCodeElement);

  // Create Preview Container (as Rect to work with addItem)
  const previewContainer = new Rect({
    stroke: COLORS.grayCardBorder,
    lineWidth: 5,
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    radius: 12,
    width: 600,
    height: 500,
    gap: 16,
    clip: true,
  });

  const previewLabel = new Txt({
    fill: '#d4d4d4',
    fontSize: 28,
    fontFamily: 'Fira Code, Consolas, monospace',
    layout: false,
    marginTop: -50,
    position: [10, 10],
    text: 'Preview',
  });

  const previewRect = new Rect({
    width: 200,
    height: 200,
    layout: false,
    fill: '#e13238',
    radius: 10,
    opacity: 0,
    stroke: '#888',
    lineWidth: 3,
  });

  previewContainer.add(previewLabel);
  previewContainer.add(previewRect);

  // Add items to the dynamic layout
  yield* showcaseLayoutRef().addItem(motionCanvasCodeCard, 1000);
  yield* waitFor(0.5);
  yield* showcaseLayoutRef().addItem(previewContainer, 600);
  yield* waitFor(0.5);

  // Set up the preview rectangle reference for animations
  const previewRectRef = createRef<Rect>();
  previewRectRef(previewRect);

  yield* previewRectRef().opacity(1, 0.8);
  yield* waitFor(0.5);

  const moveRightRange = motionCanvasCodeElement.findFirstRange(
    'yield* rect().position.x(300, 1);',
  );
  motionCanvasCodeElement.selection(moveRightRange);
  yield* previewRectRef().x(300, 1);
  const waitForRange =
    motionCanvasCodeElement.findFirstRange('yield* waitFor(1);');
  motionCanvasCodeElement.selection(waitForRange);
  yield* waitFor(1);
  const moveLeftRange = motionCanvasCodeElement.findFirstRange(
    'yield* rect().position.x(-300, 1);',
  );
  motionCanvasCodeElement.selection(moveLeftRange);
  yield* previewRectRef().x(0, 1);
  yield* waitFor(1);
  motionCanvasCodeElement.selection([]);
  yield* waitFor(1);
  motionCanvasCodeElement.selection(DEFAULT);

  // 4. After Remotion example, make Remotion logo transparent, MC logo 100%
  yield* all(
    remotionLogoRef().opacity(1, 0.6),
    remotionLogoRef().filters.grayscale(0, 0.6),
    motionCanvasLogoRef().opacity(1, 0.6),
  );
  yield* waitFor(0.2);

  // Show crown on Motion Canvas logo

  // Create code cards for dynamic layout
  const motionCanvasCard = new Rect({
    width: 500,
    height: 400,
    fill: '#1e1e1e',
    stroke: '#333',
    clip: true,
    lineWidth: 2,
    radius: 12,
    layout: true,
    direction: 'column',
    padding: 20,
    gap: 10,
    opacity: 0,
  });

  const mcCode = new Code({
    code: codeExample,
    fontSize: 16,
    fontFamily: 'Fira Code, monospace',
  });

  motionCanvasCard.add(mcCode);

  const remotionCard = new Rect({
    width: 800,
    height: 800,
    clip: true,
    fill: '#1e1e1e',
    stroke: '#333',
    lineWidth: 2,
    radius: 12,
    layout: true,
    direction: 'column',
    padding: 20,
    gap: 10,
  });

  const remotionCodeSnippet = new Code({
    code: remotionReactCode,
    fontSize: 12,
    fontFamily: 'Fira Code, monospace',
  });

  remotionCard.add(remotionCodeSnippet);

  yield* waitFor(0.5);
  yield* showcaseLayoutRef().removeByIndex(1);

  yield* waitFor(0.5);

  yield* all(
    motionCanvasCodeElement.fontSize(10, 0.8),
    motionCanvasCodeCard.width(800, 0.8),
    motionCanvasCodeCard.height(800, 0.8),
  );
  yield* waitFor(0.5);
  yield* showcaseLayoutRef().insertItem(remotionCard, 0, 800);

  yield* waitFor(0.8);

  // scale up the logos, improve gap and move down
  yield* all(
    motionCanvasLogoRef().scale(1.5, 0.8),
    remotionLogoRef().scale(1.5, 0.8),
    logoLayoutRef().gap(1800, 0.8),
    logoLayoutRef().y(-300, 0.8),
    showcaseLayoutRef().y(150, 0.8),
  );
  yield* waitFor(0.5);

  // Final animation: fade out code blocks and scale logos back to original position
  yield* all(
    showcaseLayoutRef().opacity(0, 1.0),
    logoLayoutRef().scale(1, 0.8),
    logoLayoutRef().gap(60, 0.8),
    logoLayoutRef().y(0, 0.8),
    logoLayoutRef().gap(500, 0.8),
  );
  yield* waitFor(0.5);
  // cross out remotion
  yield* remotionLogoRef().crossOut(0.8);
  yield* waitFor(0.3);
  yield* all(
    remotionLogoRef().opacity(0.5, 0.8),
    remotionLogoRef().filters.grayscale(1, 0.8),
  );

  yield* waitFor(0.5);

  // Final crown animation on Motion Canvas logo
  yield* motionCanvasLogoRef().showCrown(1.2);
  yield* waitFor(2.0);

  yield* waitFor(1.0);
});

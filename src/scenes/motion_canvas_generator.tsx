import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition, DEFAULT, createSignal } from '@motion-canvas/core';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
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
  const mcCodeCardRef = createRef<any>(); // Ref for CodeCard to use highlight methods
  // Selection signal for Remotion code block highlighting (removed unused signal)
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
          ref={mcCodeCardRef}
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
            fill={COLORS.lightGrayCard}
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
  yield* waitUntil('remotion_comparison');

  // 2. Make motion canvas logo transparent first
  yield* all(
    motionCanvasLogoRef().opacity(0.5, 0.6),
    motionCanvasLogoRef().filters.grayscale(1, 0.6),
  );
  yield* waitUntil('remotion_frame_based');
  
  // 3. Then scale both logos down to the top
  yield* all(
    logoLayoutRef().scale(0.4, 0.6),
    logoLayoutRef().y(-350, 0.6),
    logoLayoutRef().gap(100, 0.6),
  );
  yield* waitUntil('remotion_showcase');

  // 3. Slide in MC CodeCard and Preview
  yield* mcShowcaseLayoutRef().opacity(1, 1.0);
  yield* all(mcPreviewRectRef().opacity(1, 0.5));
  yield* waitUntil('frame_based_example');

  // 4. Enhanced code highlight animations for Motion Canvas using CodeCard highlight methods
  yield* mcCodeCardRef().highlight('const frame = useCurrentFrame();', 0.3);
  yield* waitFor(0.5);
  
  yield* waitUntil('frame_calculation');
  yield* mcCodeCardRef().resetHighlight(0.2);
  yield* waitUntil('transform_example');

  // Animate transform highlight
  yield* mcCodeCardRef().highlight('transform: `translateX(${frame}px)`', 0.3);
  yield* waitFor(0.3);
  
  yield* waitUntil('preview_animate');
  yield* mcPreviewRectRef().x(1200, 2.0);
  yield* waitUntil('messy_process');
  // 6. Show the meme video with zoomIn effect
  yield* all(
    zoomIn(memeVideoRef()),
    mcShowcaseLayoutRef().filters.blur(10, 0.5),
  );
  yield* waitUntil('brain_mess_meme');

  // Fade out MC showcase
  yield* all(
    mcShowcaseLayoutRef().opacity(0, 0.8),
    mcPreviewRectRef().opacity(0, 0.8),
    memeVideoRef().opacity(0, 0.8),
    mcShowcaseLayoutRef().filters.blur(0, 0.8),
  );
  
  // Remove the MC showcase layout from the scene to prevent conflicts
  mcShowcaseLayoutRef().remove();
  yield* waitUntil('motion_canvas_intro');

  // Scale logos back to center
  yield* all(
    logoLayoutRef().scale(1, 0.6),
    logoLayoutRef().y(0, 0.6),
    logoLayoutRef().gap(60, 0.6),
  );
  yield* waitUntil('sequential_order');
  // Switch opacity/grayscale to indicate Remotion first
  yield* all(
    motionCanvasLogoRef().opacity(1, 0.6),
    motionCanvasLogoRef().filters.grayscale(0, 0.6),
    remotionLogoRef().opacity(0.5, 0.6),
    remotionLogoRef().filters.grayscale(1, 0.6),
  );
  yield* waitUntil('motion_canvas_example');
  // Then scale logos back to top
  yield* all(
    logoLayoutRef().scale(0.4, 0.6),
    logoLayoutRef().y(-400, 0.6),
    logoLayoutRef().gap(100, 0.6),
  );
  yield* waitUntil('move_position_example');

  // Slide in Remotion CodeCard and Preview
  yield* showcaseLayoutRef().opacity(1, 1.0);
  yield* waitUntil('motion_canvas_code');

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

  // Create Motion Canvas CodeCard using the CodeCard component
  const motionCanvasCodeCardRef = createRef<any>();
  const motionCanvasCodeFontSize = createSignal(32);
  const motionCanvasCodeCard = CodeCard({
    code: `export default makeScene2D(function* (view) {\n  const rect = createRef<Rect>();\n  \n  view.add(<Rect ref={rect} width={100} height={100} fill=\"#e13238\" />);\n  \n  yield* rect().position.x(300, 1);\n  yield* waitFor(1);\n  yield* rect().position.x(-300, 1);\n});`,
    fontSize: motionCanvasCodeFontSize(),
    width: 1000,
    height: 500,
  });
  
  // Store the ref for later use
  motionCanvasCodeCardRef(motionCanvasCodeCard);

  // Create Preview Container (as Rect to work with addItem)
  const previewContainer = new Rect({
    stroke: COLORS.grayCardBorder,
    lineWidth: 5,
    direction: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fill: COLORS.lightGrayCard,
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
    opacity: 1,
    stroke: '#888',
    lineWidth: 3,
  });

  previewContainer.add(previewLabel);
  previewContainer.add(previewRect);

  // Add items to the dynamic layout
  yield* showcaseLayoutRef().addItem(motionCanvasCodeCard, 1000);
  yield* waitUntil('add_preview');
  yield* showcaseLayoutRef().addItem(previewContainer, 600);
  yield* waitUntil('preview_setup');

  // Set up the preview rectangle reference for animations
  const previewRectRef = createRef<Rect>();
  previewRectRef(previewRect);
  yield* waitUntil('animate_preview');

  // Enhanced Motion Canvas code highlight animations using CodeCard highlight methods
  // Animate move right highlight
  yield* motionCanvasCodeCardRef().highlight('yield* rect().position.x(300, 1);', 0.3);
  yield* previewRectRef().x(300, 1);
  
  // Animate wait highlight
  yield* motionCanvasCodeCardRef().highlight('yield* waitFor(1);', 0.3);
  yield* waitUntil('wait_second');
  
  // Animate move left highlight
  yield* motionCanvasCodeCardRef().highlight('yield* rect().position.x(-300, 1);', 0.3);
  yield* previewRectRef().x(0, 1);
  
  yield* waitUntil('move_back');
  yield* motionCanvasCodeCardRef().resetHighlight(0.2);

  // 4. After Remotion example, make Remotion logo transparent, MC logo 100%
  yield* all(
    remotionLogoRef().opacity(1, 0.6),
    remotionLogoRef().filters.grayscale(0, 0.6),
    motionCanvasLogoRef().opacity(1, 0.6),
  );
  yield* waitUntil('comparison_analysis');

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

  // Create Remotion CodeCard using the CodeCard component
  const remotionCodeCardRef = createRef<any>();
  const remotionCard = CodeCard({
    code: remotionReactCode,
    fontSize: 12,
    width: 800,
    height: 800,
  });
  
  // Store the ref for later use
  remotionCodeCardRef(remotionCard);

  yield* waitUntil('remove_preview');

  yield* all(
    showcaseLayoutRef().removeByIndex(1),
    showcaseLayoutRef().insertItem(remotionCard, 0, 800),
    motionCanvasCodeCard.width(800, 0.5),
    motionCanvasCodeCard.height(800, 0.5),
    motionCanvasCodeFontSize(12, 0.5),
    // scale down the text of the motion canvas code card to match the remotion one
  );

  yield* waitUntil('add_remotion_code');
  
  // scale up the logos, improve gap and move down
  yield* all(
    motionCanvasLogoRef().scale(1.5, 0.8),
    remotionLogoRef().scale(1.5, 0.8),
    logoLayoutRef().gap(1800, 0.8),
    logoLayoutRef().y(-300, 0.8),
    showcaseLayoutRef().y(150, 0.8),
  );
  yield* waitUntil('fade_out_comparison');

  // Final animation: fade out code blocks and scale logos back to original position
  yield* all(
    showcaseLayoutRef().opacity(0, 1.0),
    logoLayoutRef().scale(1, 0.8),
    logoLayoutRef().gap(60, 0.8),
    logoLayoutRef().y(0, 0.8),
    logoLayoutRef().gap(500, 0.8),
  );
  yield* waitUntil('cross_out_remotion');
  // cross out remotion
  yield* remotionLogoRef().crossOut(0.8);
  yield* waitUntil('gray_out_remotion');
  yield* all(
    remotionLogoRef().opacity(0.5, 0.8),
    remotionLogoRef().filters.grayscale(1, 0.8),
  );

  yield* waitUntil('motion_canvas_crown');

  // Final crown animation on Motion Canvas logo
  yield* motionCanvasLogoRef().showCrown(1.2);
  yield* waitUntil('crown_complete');

  yield* waitUntil('scene_end');
});

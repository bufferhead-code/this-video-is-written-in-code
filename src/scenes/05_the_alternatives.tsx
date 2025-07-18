import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Layout, Node, Rect } from '@motion-canvas/2d/lib/components';
import { Logo } from '../components/Logo';
import { Background } from '../components/Background';
import { DistractedBoyfriendMeme } from '../components/DistractedBoyfriendMeme';
import { PseudoCode } from '../components/PseudoCode';
import { MemeImage } from '../components/MemeImage';
import { zoomIn, fadeIn, fadeOut } from '../animation';

import davinciLogo from '../images/davinci-resolve-logo.svg';
import capcutLogo from '../images/capcut-logo.svg';
import finalCutProLogo from '../images/final-cut-pro-logo.webp';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const davinciRef = createRef<Logo>();
  const capcutRef = createRef<Logo>();
  const finalCutProRef = createRef<Logo>();
  const memeRef = createRef<Rect>();
  const codeBlockRef = createRef<Rect>();
  const logoGroupRef = createRef<Layout>();
  const newMemeRef = createRef<Rect>();

  view.add(
    <>
      <Background />

      {/* Meme background (initially hidden) */}
      <DistractedBoyfriendMeme
        ref={memeRef}
        width={'100%'}
        opacity={0}
        scale={0.8}
      />

      {/* Code block on the left (where the "other woman" is) */}
      <Rect ref={codeBlockRef} x={-320} y={-70} opacity={0} scale={0.6}>
        <PseudoCode
          code={`function createVideo() {
  return (
    <Scene>
      <Rect fill="#000">
        <Txt>Hello World</Txt>
      </Rect>
    </Scene>
  );
}`}
        />
      </Rect>

      {/* New meme from scene 06 (initially hidden) */}
      <MemeImage ref={newMemeRef} width={'100%'} opacity={0} scale={0.8} />

      {/* Logos group on top - moved to end to ensure z-index priority */}
      <Node scale={1} ref={logoGroupRef} position={[0, -150]}>
        <Logo
          ref={davinciRef}
          src={davinciLogo}
          opacity={0}
          scale={0}
          containerSize={500}
        />
        <Node position={[0, 310]}>
          <Logo
            ref={capcutRef}
            src={capcutLogo}
            opacity={0}
            x={-150}
            scale={0}
            containerSize={500}
          />
          <Logo
            ref={finalCutProRef}
            src={finalCutProLogo}
            opacity={0}
            x={150}
            containerSize={500}
          />
        </Node>
      </Node>
    </>,
  );

  yield* waitFor(1); // Start of scene 5

  // DaVinci first with zoom and fade
  yield* zoomIn(davinciRef());

  yield* waitFor(0);

  // CapCut second
  yield* zoomIn(capcutRef());

  yield* waitFor(0.4);

  // Final Cut Pro third
  yield* zoomIn(finalCutProRef());

  yield* waitFor(1.0);

  // Phase 2: Meme appears with fade in
  yield* fadeIn(memeRef(), { duration: 0.8 });

  yield* waitFor(0.5);

  // Phase 3: Scale and move logos to the right (girlfriend position)
  // and show code block on the left (other woman position)
  yield* all(
    // Move logo group to the right and scale down slightly
    logoGroupRef().position([500, -120], 1.2),
    logoGroupRef().scale(0.3, 1.2),

    // Show the code block on the left with fade in
    fadeIn(codeBlockRef(), { duration: 1.0, delay: 0.2 }),
  );

  yield* waitFor(2.0); // Hold the distracted boyfriend meme

  // Phase 4: Transition to new meme - fade out distracted boyfriend and code block, show new meme
  yield* all(
    fadeOut(memeRef(), { duration: 0.5 }),
    fadeOut(codeBlockRef(), { duration: 0.5 }),
    fadeIn(newMemeRef(), { duration: 0.8, delay: 0.3 }),
    // Move logos up a bit when new meme appears
    logoGroupRef().position([400, -450], 0.8),
  );

  yield* waitUntil('end'); // Adjust timing for the new sequence
});

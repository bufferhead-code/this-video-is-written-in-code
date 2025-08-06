import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Layout, Node, Rect, Img } from '@motion-canvas/2d/lib/components';
import { Logo } from '../components/Logo';
import { Background } from '../components/Background';
import { DistractedBoyfriendMeme } from '../components/DistractedBoyfriendMeme';
import { PseudoCode } from '../components/PseudoCode';
import { MemeImage } from '../components/MemeImage';
import { StyledText } from '../components/StyledText';
import { Browser } from '../components/Browser';
import { MacOSBackground } from '../components/MacOSBackground';
import { zoomIn, fadeIn, fadeOut } from '../animation';

import davinciLogo from '../images/davinci-resolve-logo.svg';
import capcutLogo from '../images/capcut-logo.svg';
import finalCutProLogo from '../images/final-cut-pro-logo.webp';
import youtubeVideoScreen from '../images/youtube_video_screen.png';
import { fadeTransition } from '@motion-canvas/core';
import { playZoomIn, SoundEffects } from '../soundeffects';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const davinciRef = createRef<Logo>();
  const capcutRef = createRef<Logo>();
  const finalCutProRef = createRef<Logo>();
  const memeRef = createRef<Rect>();
  const codeBlockRef = createRef<Rect>();
  const logoGroupRef = createRef<Layout>();
  const newMemeRef = createRef<Rect>();
  const styledTextRef = createRef<StyledText>();
  const browserRef = createRef<Browser>();
  const macOSBackgroundRef = createRef<MacOSBackground>();
  const scaledBackgroundRef = createRef<Rect>();

  view.add(
    <>
      {/* MacOS Background as the base layer */}
      <MacOSBackground
        ref={macOSBackgroundRef}
        showMenuBar={false}
        showDock={false}
      />

      {/* Browser with YouTube video screen */}
      <Browser
        ref={browserRef}
        width={1800}
        height={800}
        position={[0, -90]}
        opacity={0}
        screenshotSrc={youtubeVideoScreen}
      />

      {/* Scaled down background with styled text */}
      <Rect
        ref={scaledBackgroundRef}
        width="100%"
        height="100%"
        position={[0, 0]}
      >
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

        {/* Styled text saying "This video is code" */}
        <StyledText
          ref={styledTextRef}
          text=""
          size="xl"
          colorType="secondary"
          opacity={0}
        />

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
      </Rect>
    </>,
  );

  // add fade transition
  yield* fadeTransition(1);

  yield* waitUntil('scene_start');

  // All three logos zoom in with slight delays
  yield* all(
    zoomIn(davinciRef()),
    zoomIn(capcutRef(), { delay: 0.25 }),
    zoomIn(finalCutProRef(), { delay: 0.5 }),
  );

  yield* waitUntil('meme_appear');


  // Phase 2: Meme appears with fade in
  yield* fadeIn(memeRef(), { duration: 0.8 });

  // zoom sound effect
  playZoomIn({ duration: 1.2 });

  yield* all(
    // Move logo group to the right and scale down slightly
    logoGroupRef().position([500, -120], 1.2),
    logoGroupRef().scale(0.3, 1.2),
  );


  yield* waitUntil('code_block_appear');
    // Show the code block on the left with fade in
  yield* fadeIn(codeBlockRef(), { duration: 1.0, delay: 0.2 }),

  // Phase 3: Scale and move logos to the right (girlfriend position)
  // and show code block on the left (other woman position)

  yield* waitUntil('new_meme_transition');
  playZoomIn({ duration: 1 });

  // Phase 4: Transition to new meme - fade out distracted boyfriend and code block, show new meme
  yield* all(
    fadeOut(memeRef(), { duration: 0.5 }),
    fadeOut(codeBlockRef(), { duration: 0.5 }),
    fadeIn(newMemeRef(), { duration: 0.8, delay: 0.3 }),
    // Move logos up a bit when new meme appears
    logoGroupRef().position([400, -450], 0.8),
  );

  yield* waitUntil('text_appear');

  // new styled text saying "This Video is code" with typewriter effect
  yield* all(
    fadeOut(newMemeRef(), { duration: 0.5 }),
    fadeOut(logoGroupRef(), { duration: 0.5 }),
  );
  yield* fadeIn(styledTextRef(), { duration: 0.5 });
  yield* styledTextRef().typewrite("This video is code", 1);

  yield* waitUntil('mac_window_appear');

  // Show Browser with YouTube video screen
  yield* fadeIn(browserRef(), { duration: 0.8 });


  yield* waitUntil('scale_down_background');

  // Scale down the background
  playZoomIn({ duration: 1.2 });

  yield* all(
    scaledBackgroundRef().scale(0.56, 1.2),
    // move up
    scaledBackgroundRef().position([0, -28], 1.2),
  );


  yield* waitUntil('end'); // Adjust timing for the new sequence
});

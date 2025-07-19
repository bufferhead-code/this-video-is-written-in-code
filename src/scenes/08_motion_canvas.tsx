import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition, createSignal } from '@motion-canvas/core';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Code, Video } from '@motion-canvas/2d/lib/components';
import { Logo } from '../components/Logo';
import { Browser } from '../components/Browser';
import { YoutubeChannelCard } from '../components/YouTubeChannelCard';
import { BlueprintBackground } from '../components/BlueprintBackground';
import { zoomIn, slideInBottom } from '../animation';
import { MEME_STYLE } from '../components/MemeStyle';

import motionCanvasLogo from '../images/motion-canvas-logo.svg';
import motionCanvasScreenshot from '../images/motion-canvas-screenshot.png';
import aarthificialAvatar from '../images/aarthificial-avatar.jpg';
import myBrainMessVideo from '../images/my_brain_mess.mp4';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const motionCanvasLogoRef = createRef<Logo>();
  const motionCanvasBrowserRef = createRef<Browser>();
  const aarthificialCardRef = createRef<YoutubeChannelCard>();

  view.add(
    <Rect ref={sceneRef} width={'100%'} height={'100%'}>
      {/* Blueprint background */}
      <BlueprintBackground width={'100%'} height={'100%'} />
      {/* Motion Canvas Logo */}
      <Logo
        ref={motionCanvasLogoRef}
        src={motionCanvasLogo}
        containerSize={300}
        zIndex={100}
        opacity={0}
        scale={0}
      />
      {/* Browser with Motion Canvas website */}
      <Browser
        ref={motionCanvasBrowserRef}
        url="https://motioncanvas.io"
        screenshotSrc={motionCanvasScreenshot}
        width={1600}
        opacity={0}
      />
      {/* YouTube channel card for aarthificial */}
      <YoutubeChannelCard
        ref={aarthificialCardRef}
        channelName="aarthificial"
        username="@aarthificial"
        subscribers="164K subscribers"
        videos="51 videos"
        description="Hi, my name's Jacob. I make concise videos about the technical side of game development"
        avatarSrc={aarthificialAvatar}
        opacity={0}
        x={0}
        y={0}
      />
      {/* Meme video with meme style */}
    </Rect>,
  );

  yield* fadeTransition(1);

  // Motion Canvas animation sequence
  yield* zoomIn(motionCanvasLogoRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1.5,
    overshoot: true,
  });

  yield* waitFor(1.0); // Let the logo settle

  yield* waitFor(0.5); // Brief pause after cross-out

  // Hide Motion Canvas logo and show browser with Motion Canvas website
  yield* all(
    // fade out Motion Canvas logo to the bottom center
    motionCanvasLogoRef().opacity(0, 1),
    motionCanvasLogoRef().position([0, 700], 1),
    motionCanvasLogoRef().scale(0, 1),
    slideInBottom(motionCanvasBrowserRef(), {
      duration: 1.0,
      distance: 300,
    }),
  );

  yield* waitFor(0.5);

  // zoom in to Motion Canvas browser
  yield* all(
    motionCanvasBrowserRef().scale(2, 1),
    motionCanvasBrowserRef().position([0, 100], 1),
  );

  yield* waitFor(2.0);

  // Show aarthificial YouTube channel card
  yield* all(
    zoomIn(aarthificialCardRef()),
    motionCanvasBrowserRef().filters.blur(10, 0.5),
  );

  yield* waitFor(1.5);

  // Hide YouTube channel card and unblur browser
  yield* all(
    motionCanvasBrowserRef().filters.blur(0, 0.5),
    aarthificialCardRef().opacity(0, 0.5),
  );

  yield* waitFor(1.0);

  // Show the meme video with zoomIn effect
});

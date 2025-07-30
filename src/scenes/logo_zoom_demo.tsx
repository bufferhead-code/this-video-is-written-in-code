import { makeScene2D } from '@motion-canvas/2d';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { all } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect } from '@motion-canvas/2d/lib/components';
import { zoomIn, slideInBottom } from '../animation';
import { YoutubeChannelCard } from '../components/YouTubeChannelCard';
import { Browser } from '../components/Browser';

import motionCanvasLogoColored from '../images/motion-canvas-logo-dark.svg';
import aarthificialAvatar from '../images/aarthificial-avatar.jpg';
import motionCanvasDocsQuickstart from '../images/motion_canvas_docs_quickstart.jpeg';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Rect>();
  const logoContainerRef = createRef<Rect>();
  const logoRef = createRef<Img>();
  const aarthificialCardRef = createRef<YoutubeChannelCard>();
  const browserRef = createRef<Browser>();

  // Dark gray background
  view.add(
    <Rect
      ref={backgroundRef}
      width={'100%'}
      height={'100%'}
      fill={'#171717'}
    />
  );

  // Logo container with Motion Canvas logo
  view.add(
    <Rect ref={logoContainerRef}>
      <Img
        ref={logoRef}
        src={motionCanvasLogoColored}
        width={400}
        height={400}
        scale={0}
        opacity={0}
      />
    </Rect>
  );

  // YouTube channel card for aarthificial
  view.add(
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
  );

  // Browser component with Motion Canvas docs
  view.add(
    <Browser
      ref={browserRef}
      url="https://motioncanvas.io/docs/quickstart"
      screenshotSrc={motionCanvasDocsQuickstart}
      width={1750}
      height={600}
      opacity={0}
      y={-150}
    />
  );

  // Single zoomIn animation
  yield* zoomIn(logoRef(), {
    duration: 1.5,
    fromScale: 0,
    toScale: 2,
    overshoot: true
  });

  yield* waitFor(1.0);

  // Show aarthificial YouTube channel card with blur effect on logo container
  yield* all(
    zoomIn(aarthificialCardRef()),
    logoContainerRef().filters.blur(10, 0.5),
  );

  yield* waitFor(1.5);

  yield* aarthificialCardRef().opacity(0, 0.8),

  // Slide in browser from bottom while fading out YouTube card
  yield* all(
    slideInBottom(browserRef(), { duration: 0.8 }),
  );

  yield* logoContainerRef().filters.blur(0, 0.5),

  yield* waitFor(1.0);
}); 
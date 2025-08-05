import { makeScene2D, signal } from '@motion-canvas/2d';
import { createSignal, fadeTransition } from '@motion-canvas/core';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Layout, Node, Img } from '@motion-canvas/2d/lib/components';
import { Logo } from '../components/Logo';
import { Browser } from '../components/Browser';
import { MEME_STYLE } from '../components/MemeStyle';
import { BlueprintBackground } from '../components/BlueprintBackground';
import { zoomIn, slideInBottom } from '../animation';

import manimLogo from '../images/manim-logo.svg';
import remotionLogo from '../components/media/remotion-logo.svg';
import remotionScreenshot from '../images/remotion_screenshot.png';
import youtubeThumbnail from '../images/youtube-video-thumbnail.png';
import { Crossout } from '../components/Crossout';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const browserRef = createRef<Browser>();
  const youtubeImageRef = createRef<Img>();
  const crossoutRef = createRef<Crossout>();
  view.add(
    <Rect ref={sceneRef} width={'100%'} height={'100%'}>
      <BlueprintBackground width={'100%'} height={'100%'} />
      {/* Browser with remotion website */}
      <Browser
        ref={browserRef}
        url="https://www.remotion.dev"
        screenshotSrc={remotionScreenshot}
        width={1600}
        opacity={0}
        darkMode={true}
      />

      {/* YouTube video thumbnail */}
      <Img
        ref={youtubeImageRef}
        src={youtubeThumbnail}
        width={1200}
        {...MEME_STYLE}
        opacity={0}
      />
      <Crossout ref={crossoutRef} text="intro" textSize={50} textPosition="above" width={120} textOffset={60} position={[-375, 290]} />
    </Rect>,
  );

  yield* fadeTransition(1);

  // Create two-column layout
  const layoutRef = createRef<Layout>();
  const secondManimLogoRef = createRef<Logo>();
  const blueLogoRef = createRef<Logo>();

  // gap signal
  const gapSignal = createSignal(200);
  view.add(
    <Layout ref={layoutRef} layout={true} gap={gapSignal} direction="row">
      <Logo
        ref={secondManimLogoRef}
        src={manimLogo}
        y={0}
        opacity={0}
        containerSize={500}
      />
      <Logo
        ref={blueLogoRef}
        src={remotionLogo}
        containerSize={500}
        opacity={0}
        shadowColor="rgba(0, 0, 0, 0.1)"
      />
    </Layout>,
  );

  // Zoom fade in from center

  yield* zoomIn(secondManimLogoRef());
  yield* secondManimLogoRef().typewriteText('Manim');
  yield* waitUntil('manim_cross_out');
  yield* secondManimLogoRef().crossOut();
  yield* waitUntil('remotion_appear');
  yield* zoomIn(blueLogoRef());
  yield* blueLogoRef().typewriteText('Remotion');
  yield* waitUntil('logos_merge');
  yield* secondManimLogoRef().opacity(0, 0.5);
  yield* all(gapSignal(0, 0.5), layoutRef().width(0, 0.5));

  yield* waitUntil('show_remotion_website');

  // Hide logos and show browser with remotion website
  yield* all(
    // fade out remotion logo to the bottom center
    blueLogoRef().opacity(0, 1),
    blueLogoRef().position([0, 700], 1),
    blueLogoRef().scale(0, 1),
    slideInBottom(browserRef(), {
      duration: 1.0,
      distance: 300,
    }),
  );

  yield* waitUntil('zoom_remotion');

  // zoom in to remotion browser
  yield* all(browserRef().scale(2, 1), browserRef().position([0, 100], 1));

  yield* waitUntil('youtube_thumbnail_appear');

  // Slide in YouTube video thumbnail from bottom
  yield* browserRef().filters.blur(10, 1);
  yield* slideInBottom(youtubeImageRef(), {
    duration: 1.0,
    distance: 300,
  });

  yield* crossoutRef().animateCrossout(1);
  yield* crossoutRef().animateText(1);

  yield* waitUntil('primary_use_case');

  yield* all(
    youtubeImageRef().opacity(0, 1),
    crossoutRef().opacity(0, 1),
    browserRef().filters.blur(0, 1)
  );

  yield* waitUntil('data_driven_videos');

  // move the browser down
  yield* all(browserRef().position([0, -2500], 1), browserRef().scale(1.6, 1));

  yield* waitUntil('another_tool');

  yield* youtubeImageRef().opacity(0, 1);

  yield* waitUntil('scene_end');
});

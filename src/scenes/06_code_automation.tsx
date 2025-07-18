import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition } from '@motion-canvas/core';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { Rect, Node } from '@motion-canvas/2d/lib/components';
import { MemeImage } from '../components/MemeImage';
import { RedButtonMeme } from '../components/RedButtonMeme';
import { Logo } from '../components/Logo';
import { Browser } from '../components/Browser';
import { zoomIn, slideInBottom } from '../animation';
import { COLORS } from '../utils/colors';

import manimLogo from '../images/manim-logo.svg';
import manimScreenshot from '../images/manim_screenshot.png';
import aarthificialAvatar from '../images/aarthificial-avatar.jpg';
import { TextMarker } from '../components/TextMarker';
import { YoutubeChannelCard } from '../components/YouTubeChannelCard';
import threeBlueBrownAvatar from '../images/3blue1brown-logo.svg';
import { CircleMark } from '../components/CircleMark';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const manimLogoRef = createRef<Logo>();
  const browserRef = createRef<Browser>();

  view.add(
    <Rect ref={sceneRef} width={'100%'} height={'100%'} fill={COLORS.grayBg}>
      {/* Manim Logo in center */}
      <Logo
        ref={manimLogoRef}
        src={manimLogo}
        containerSize={300}
        zIndex={100}
        opacity={0}
        scale={0}
      />

      {/* Browser with manim website */}
      <Browser
        ref={browserRef}
        url="https://www.manim.community"
        screenshotSrc={manimScreenshot}
        width={1600}
        opacity={0}
      >
        <TextMarker
          markerColor="#FF6B6B"
          markerOpacity={0.7}
          animationDuration={1.2}
        />
      </Browser>
    </Rect>,
  );

  yield* fadeTransition(1);

  yield* zoomIn(manimLogoRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1.5,
    overshoot: true,
  });

  yield* waitFor(1.0); // Let the logo settle

  // Cross out the manim logo

  yield* waitFor(0.5); // Brief pause after cross-out

  // Hide pseudo-code and show browser with manim website
  yield* all(
    // fade out manim logo to the bottom center
    manimLogoRef().opacity(0, 1),
    manimLogoRef().position([0, 700], 1),
    manimLogoRef().scale(0, 1),
    slideInBottom(browserRef(), {
      duration: 1.0,
      distance: 300,
    }),
  );

  yield* waitFor(0.5); // When meme is mentioned

  // zoom in to manim browser
  yield* all(browserRef().scale(2, 1), browserRef().position([0, 100], 1));

  yield* waitFor(0.5); // When meme is mentioned

  // add youtube channel cards
  const threeBlueBrownCardRef = createRef<YoutubeChannelCard>();
  const aarthificialCardRef = createRef<YoutubeChannelCard>();
  view.add(
    <YoutubeChannelCard
      ref={threeBlueBrownCardRef}
      channelName="3Blue1Brown"
      avatarSrc={threeBlueBrownAvatar}
      username="@3blue1brown"
      subscribers="7.44M subscribers"
      videos="214 videos"
      description="My name is Grant Sanderson. Videos here cover a variety of topics in math, or adjacent fields like physics and CS, all with an emphasis on visualizing the core ideas."
      opacity={0}
      x={0}
      y={0}
    />,
  );

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
      x={400}
      y={0}
    />,
  );

  yield* waitFor(1.5); // When meme is mentioned

  // animate in youtube channel cards
  yield* all(
    zoomIn(threeBlueBrownCardRef()),
    browserRef().filters.blur(10, 0.5),
  );

  yield* waitFor(1.5);

  // unblur image, fade out youtube channel cards
  yield* all(
    browserRef().filters.blur(0, 0.5),
    threeBlueBrownCardRef().opacity(0, 0.5),
  );

  // Hide red button meme and continue with original scene
  yield* all(browserRef().opacity(1, 0.8), browserRef().scale(2, 0.8));

  const textMarkerRef = createRef<TextMarker>();
  view.add(
    <TextMarker
      ref={textMarkerRef}
      opacity={1}
      zIndex={100}
      x={420}
      y={100}
      width={800}
      height={70}
    />,
  );

  yield* textMarkerRef().animateMarkerPen(0);

  yield* waitFor(1.5);

  yield* textMarkerRef().opacity(0, 1);

  yield* waitFor(1.5);

  // add a red text marker
  const textMarkerRef2 = createRef<TextMarker>();
  view.add(
    <TextMarker
      ref={textMarkerRef2}
      opacity={1}
      markerColor="#FF0000"
      x={-120}
      y={100}
      width={300}
      height={70}
    />,
  );

  yield* textMarkerRef2().animateMarkerPen(0);

  yield* waitFor(1.5);

  // Add red button meme for automation concept
  const redButtonMemeRef = createRef<RedButtonMeme>();
  view.add(
    <RedButtonMeme
      ref={redButtonMemeRef}
      textSize="xl"
      textColorType="primary"
      opacity={0}
      scale={0}
    />,
  );

  // Hide browser and show red button meme
  yield* all(
    browserRef().filters.blur(10, 0.8),
    zoomIn(redButtonMemeRef(), {
      duration: 1.0,
      fromScale: 0,
      toScale: 1,
    }),
  );

  // Animate typewriter text about automation
  yield* redButtonMemeRef().typewrite('Erase Python', 2);
  yield* waitFor(1);

  yield* waitUntil('end_scene_6'); // End of scene 6
});

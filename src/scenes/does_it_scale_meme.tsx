import { makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core/lib/utils';
import { waitFor, waitUntil, all } from '@motion-canvas/core/lib/flow';
import { Img, Video } from '@motion-canvas/2d/lib/components';
import { Background } from '../components/Background';
import { MEME_STYLE } from '../components/MemeStyle';
import { zoomIn } from '../animation';
import { Browser } from '../components/Browser';
import doesItScaleImage from '../images/does_it_scale.png';
import canvasScreenshot from '../components/media/canvas_screenshot.jpeg';
import motionCanvasScrubbing from '../images/motion_canvas_scrubbing.mov?url';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Img>();
  const memeRef = createRef<Img>();
  const browserRef = createRef<Browser>();
  const videoRef = createRef<Video>();

  // Add background
  view.add(<Background ref={backgroundRef} />);

  // Add meme image with MemeStyle and 70% width
  view.add(
    <Img
      ref={memeRef}
      src={doesItScaleImage}
      height={1080 * 0.9} // 70% of screen height
      {...MEME_STYLE}
    />,
  );

  // Animate the meme with zoomIn from center
  yield* zoomIn(memeRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1,
  });

  // Wait for meme to be visible
  yield* waitUntil('meme-visible');

  // Fade out the meme
  yield* memeRef().opacity(0, 0.5);

  // Wait for fade out to complete
  yield* waitUntil('meme-faded');

  // Add Browser component with canvas screenshot
  view.add(
    <Browser
      ref={browserRef}
      width={1920 * 0.95} // 95% of width - bigger
      screenshotSrc={canvasScreenshot}
      url="https://motioncanvas.io/docs/"
    />,
  );

  // Animate browser fadeInFromBottom
  browserRef().opacity(0);
  browserRef().position.y(50); // Start from even higher position
  yield* all(
    browserRef().opacity(1, 0.8),
    browserRef().position.y(-100, 0.8) // Move up to -100 instead of -50
  );

  // Wait for browser to be fully visible
  yield* waitUntil('browser-visible');

  // Fade out the browser
  yield* browserRef().opacity(0, 0.5);

  // Wait for browser to fade out
  yield* waitUntil('browser-faded');

  // Add video with meme style
  view.add(
    <Video
      ref={videoRef}
      src={motionCanvasScrubbing}
      width={1920 * 0.9} // 90% of screen width
      play
      {...MEME_STYLE}
    />,
  );

  // Animate video with meme-style zoom in from center
  yield* zoomIn(videoRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1,
  });

  // Wait a bit to show the video
  yield* waitUntil('end');
}); 
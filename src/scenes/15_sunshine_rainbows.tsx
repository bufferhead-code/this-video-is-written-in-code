import { makeScene2D, Video, Img } from '@motion-canvas/2d';
import { all, waitFor, waitUntil, createRef, easeOutCubic, fadeTransition } from '@motion-canvas/core';
import { RainbowBackground } from '../components/RainbowBackground';
import { StyledText } from '../components/StyledText';
import { MEME_STYLE } from '../components/MemeStyle';
import { zoomIn } from '../animation';
import computerGasolineVideo from '../images/computer-gasoline.mp4?url';

export default makeScene2D(function* (view) {
  // Create references
  const background = createRef<Img>();
  const text = createRef<StyledText>();
  const video = createRef<Video>();

  // Add rainbow background
  view.add(
    <RainbowBackground
      ref={background}
      width="100%"
      height="100%"
    />
  );

  // Add video (initially invisible)
  view.add(
    <Video
      ref={video}
      src={computerGasolineVideo}
      height="90%"
      opacity={0}
      scale={0}
      {...MEME_STYLE}
    />
  );

  // Add styled text
  view.add(
    <StyledText
      ref={text}
      text=""
      size="2xl"
      colorType="secondary"
      opacity={0}
      position={[0, 0]}
    />
  );

  // Fade transition into scene
  yield* fadeTransition(1);


  // Wait for text to appear
  yield* waitUntil('text_appears');

  // Fade in text
  yield* text().opacity(1, 0.5, easeOutCubic);

  // Wait for typewriter to start
  yield* waitUntil('typewriter_starts');

  // Typewrite the text
  yield* text().typewrite("Sunshine & Rainbows", 1);

  // Wait for completion
  yield* waitUntil('text_complete');

  // Hold for a moment
  yield* waitFor(1);

  // Wait for text fade out
  yield* waitUntil('text_fade_out');

  // Fade out the text
  yield* text().opacity(0, 0.5, easeOutCubic);

  // Wait for video zoom
  yield* waitUntil('video_zoom');
  // Start playing the video
  video().play();

  // Zoom in the video
  yield* zoomIn(video(), { duration: 1 });

  // Wait for scene end
  yield* waitUntil('scene_end');
}); 
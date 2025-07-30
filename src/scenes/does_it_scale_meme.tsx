import { makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core/lib/utils';
import { waitFor } from '@motion-canvas/core/lib/flow';
import { Img } from '@motion-canvas/2d/lib/components';
import { Background } from '../components/Background';
import { MEME_STYLE } from '../components/MemeStyle';
import { zoomIn } from '../animation';
import doesItScaleImage from '../images/does_it_scale.png';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Img>();
  const memeRef = createRef<Img>();

  // Add background
  view.add(<Background ref={backgroundRef} />);

  // Add meme image with MemeStyle and 70% width
  view.add(
    <Img
      ref={memeRef}
      src={doesItScaleImage}
      width={1920 * 0.7} // 70% of screen width
      height={1080 * 0.7} // 70% of screen height
      {...MEME_STYLE}
    />,
  );

  // Animate the meme with zoomIn from center
  yield* zoomIn(memeRef(), {
    duration: 0.8,
    fromScale: 0,
    toScale: 1,
  });

  // Wait a bit to show the meme
  yield* waitFor(3);
}); 
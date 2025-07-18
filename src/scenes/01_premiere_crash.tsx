import { grayscale, makeScene2D, saturate } from '@motion-canvas/2d';
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { sound } from '@motion-canvas/core';
import { PremiereProWithErrors } from '../components/PremiereProWithErrors';
import { MacOSBackground } from '../components/MacOSBackground';
import { RainbowBackground } from '../components/RainbowBackground';
import { StyledText } from '../components/StyledText';

import typewriterSound from '../sounds/typewriter.mp3';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<MacOSBackground>();
  const rainbowSceneRef = createRef<Rect>();
  const typewriterTextRef = createRef<StyledText>();

  view.add(<MacOSBackground ref={backgroundRef} />);

  yield* backgroundRef().animateMenuBar(true);

  yield* waitFor(0.2);

  // Create the Premiere Pro with errors component
  const premiereWithErrors = yield* PremiereProWithErrors({
    zIndex: 1000,
    width: 1480,
  });

  view.add(premiereWithErrors.container);

  // Run the animation sequence
  yield* premiereWithErrors.animateSequence();

  // Add the rainbow background scene (initially hidden)
  view.add(
    <Rect ref={rainbowSceneRef} opacity={0} width={'100%'} height={'100%'}>
      <RainbowBackground width={'100%'} height={'100%'} />
      <StyledText
        ref={typewriterTextRef}
        colorType="secondary"
        size="xl"
        text=""
      />
    </Rect>,
  );

  // Scale and move Premiere Pro window to top center, and fade out error windows at the same time
  yield* waitFor(1.0); // Add delay before animations
  yield* all(
    premiereWithErrors.fadeOutSequence(),
    rainbowSceneRef().opacity(1, 0.5),
  );

  // Use StyledText typewriter effect
  const fullText = 'Time for a change';
  const typewriterAudio = sound(typewriterSound);

  // Play typewriter sound at regular intervals during the animation
  const soundInterval = 1.6 / fullText.length; // Match the typewriter duration
  const playTypewriterSound = function* () {
    for (let i = 0; i < fullText.length; i++) {
      typewriterAudio.play();
      yield* waitFor(soundInterval);
    }
  };

  const playTypewriterAnimation = function* () {
    yield* typewriterTextRef().typewrite(fullText, 1.6);
  };

  // Run typewriter animation and sound in parallel
  yield* all(playTypewriterAnimation(), playTypewriterSound());

  yield* waitFor(2.0); // Wait time to see the final text
});

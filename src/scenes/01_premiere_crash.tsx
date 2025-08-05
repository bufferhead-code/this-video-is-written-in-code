import { grayscale, makeScene2D, saturate } from '@motion-canvas/2d';
import { all, delay, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { sound, fadeTransition } from '@motion-canvas/core';
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

  yield* waitUntil('premiere_appears');

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
  yield* waitUntil('time_for_change_start');
  yield* all(
    premiereWithErrors.fadeOutSequence(),
    rainbowSceneRef().opacity(1, 0.5),
  );

  // Use StyledText typewriter effect
  const fullText = 'Time for a change';
  const typewriterAudio = sound(typewriterSound);

  typewriterAudio.gain(0);
  typewriterAudio.trim(0, 1);

  yield* waitUntil('time_for_change_text');

  // Run typewriter animation and sound in parallel
  typewriterAudio.play();
  yield* typewriterTextRef().typewrite(fullText, 1);

  yield* waitUntil('scene_end');
});

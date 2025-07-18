import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Txt } from '@motion-canvas/2d/lib/components';
import { sound } from '@motion-canvas/core';
import { RainbowBackground } from '../components/RainbowBackground';
import typewriterSound from '../sounds/typewriter.mp3';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const typewriterTextRef = createRef<Txt>();
  const fullText = 'Time for a change';

  view.add(
    <Rect ref={sceneRef} opacity={0} width={'100%'} height={'100%'}>
      <RainbowBackground width={'100%'} height={'100%'} />
      <Txt
        ref={typewriterTextRef}
        text={''}
        fill={'#fff'}
        fontSize={128}
        fontWeight={700}
      />
    </Rect>,
  );

  yield* sceneRef().opacity(1, 0.5);

  yield* waitFor(0.1); // Start typewriter animation after scene transition

  const typewriterAudio = sound(typewriterSound);
  for (let i = 0; i <= fullText.length; i++) {
    typewriterTextRef().text(fullText.substring(0, i));
    typewriterAudio.play();
    yield* waitFor(0.1);
  }

  yield* waitFor(0.3); // Adjust wait time based on typing speed

  yield* sceneRef().opacity(0, 0.5);
});

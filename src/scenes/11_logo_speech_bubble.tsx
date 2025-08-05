import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect } from '@motion-canvas/2d/lib/components';
import { Logo } from '../components/Logo';
import { SpeechBubble } from '../components/SpeechBubble';
import { slideInBottom, fadeIn, fadeOut } from '../animation';
import { CodeCard } from '../components/CodeCard';
import { Code } from '@motion-canvas/2d/lib/components';
import { easeInCirc, easeInCubic, easeInElastic, easeInOutBack, easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import motionCanvasLogoColored from '../images/motion-canvas-logo.svg';
import { DEFAULT } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Rect>();
  const logoRef = createRef<Logo>();
  const speechBubbleRef = createRef<SpeechBubble>();
  const codeCardRef = createRef<Rect>();
  const codeRef = createRef<Code>();

  // Dark background
  view.add(
    <Rect
      ref={backgroundRef}
      width={'100%'}
      height={'100%'}
      fill={'#171717'}
    />
  );

  // Motion Canvas logo
  view.add(
    <Logo
      ref={logoRef}
      src={motionCanvasLogoColored}
      containerSize={400}
      position={[0, 100]}
      opacity={0}
      zIndex={100}
    />
  );

  // Speech bubble positioned above the logo
  view.add(
    <SpeechBubble
      ref={speechBubbleRef}
      text=""
      textSize="xl"
      textColorType="primary"
      bubbleWidth={380}
      bubbleHeight={130}
      bubbleColor="#ffffff"
      bubbleStroke="#cccccc"
      cornerRadius={25}
      tailSize={20}
      tailPosition="bottom-center"
      position={[0, -120]}
      opacity={0}
      zIndex={120}
    />
  );

  // CodeCard (initially hidden, below the screen)
  view.add(
    <CodeCard
      ref={codeCardRef}
      code={"myCircle().position.x(300, 1, easeInCubic)"}
      codeRef={codeRef}
      position={[-300, -100]}
      scale={1.2}
      opacity={0}
    />
  );

  // Animation sequence
  
  // 1. Logo slides in from bottom with fade
  yield* slideInBottom(logoRef(), {
    distance: 300,
    overshoot: true
  });

  yield* waitUntil('show_speech_bubble');

  // 2. Speech bubble appears first
  yield* fadeIn(speechBubbleRef(), {
    duration: 0.6
  });

  yield* waitUntil('typewriter_text');

  // 3. Typewriter effect: "I got you"
  yield* speechBubbleRef().typewrite("I got you", 0.5);

  yield* waitUntil('hide_speech_bubble');

  yield* fadeOut(speechBubbleRef(), {
    duration: 0.6
  });

  
  // 4. Slide in CodeCard and animate other elements simultaneously
  yield* all(
    slideInBottom(codeCardRef(), {
      overshoot: true
    }),
    logoRef().position.x(500, 1),
  );

  // show teach image
  yield* logoRef().showTeach();


  // wait for 0.5 seconds
  yield* waitUntil('highlight_300');


  // highlight code "300"
  yield* all(
    codeRef().selection(codeRef().findAllRanges("300"), 0.5),
    logoRef().position.x(270, 0.5),
  );

  // wait for 0.5 seconds
  yield* waitUntil('highlight_1');

  // highlight code "1"
  yield* all(
    codeRef().selection(codeRef().findAllRanges("1"), 0.5),
    logoRef().position.x(370, 0.5),
  );

  // wait for 0.5 seconds
  yield* waitUntil('highlight_ease');

  // highlight code "1"
  yield* all(
    codeRef().selection(codeRef().findAllRanges("easeInCubic"), 0.5),
    logoRef().position.x(570, 0.5),
  );

  // Hold the final frame for a moment
  yield* waitUntil('end');

  // reset selection  
  yield* codeRef().selection(DEFAULT, 0.5);
});
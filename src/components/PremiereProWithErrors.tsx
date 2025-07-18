import { Img, Rect } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, delay, waitFor } from '@motion-canvas/core/lib/flow';
import { sound } from '@motion-canvas/core';
import { PremiereProWindow } from './PremiereProWindow';
import { MacErrorWindow } from './MacErrorWindow';
import { MacWindow } from './MacWindow';
import { slideInBottom } from '../animation';

import errorSound from '../sounds/error.mp3';

export interface PremiereProWithErrorsProps {
  zIndex?: number;
  width?: number;
}

export function* PremiereProWithErrors({
  zIndex = 1000,
  width = 1480,
}: PremiereProWithErrorsProps) {
  const premiereWindowRef = createRef<Img>();
  const error1Ref = createRef<MacWindow>();
  const error2Ref = createRef<MacWindow>();
  const error3Ref = createRef<MacWindow>();

  const containerRef = createRef<Rect>();

  // Create the container with all elements
  const container = (
    <Rect zIndex={zIndex} ref={containerRef}>
      <PremiereProWindow
        ref={premiereWindowRef}
        zIndex={zIndex}
        width={width}
      />
      <MacErrorWindow
        ref={error1Ref}
        title="Error"
        message="Premiere Pro has encountered an error."
        opacity={0}
        zIndex={zIndex + 1}
        x={100}
        y={-150}
      />
      <MacErrorWindow
        ref={error2Ref}
        title="Error"
        message="An unknown error occurred."
        zIndex={zIndex + 1}
        opacity={0}
        x={-150}
        y={50}
      />
      <MacErrorWindow
        ref={error3Ref}
        title="Fatal Error"
        message="Your project file is now corrupt."
        zIndex={zIndex + 1}
        opacity={0}
        x={250}
        y={150}
      />
    </Rect>
  );

  // Animation sequence
  const animateSequence = function* () {
    // Animate the Premiere Pro window sliding in from the bottom
    yield* slideInBottom(premiereWindowRef());

    yield* waitFor(0.5);

    // make the mac screenshot transparent and grayscale and scale it down all at the same time
    yield* all(
      premiereWindowRef().opacity(80, 0.3),
      premiereWindowRef().filters.saturate(0.2, 0.3),
      premiereWindowRef().filters.brightness(0.5, 0.3),
      premiereWindowRef().scale(0.9, 0.3),
      error1Ref().opacity(0, 0.3),
      error2Ref().opacity(0, 0.3),
      error3Ref().opacity(0, 0.3),
    );

    const errorAudio = sound(errorSound);

    errorAudio.play();
    yield* error1Ref().opacity(1, 0.2);

    errorAudio.play();
    yield* error2Ref().opacity(1, 0.2);

    errorAudio.play();
    yield* error3Ref().opacity(1, 0.2);
  };

  // Scale and fade out animation
  const fadeOutSequence = function* () {
    yield* all(
      premiereWindowRef().scale(0, 1.5),
      premiereWindowRef().position([0, -150], 1.5),
      // Scale down error windows but keep them visible and move them into rainbow area
      error1Ref().scale(0.2, 1.5),
      error1Ref().position([-200, 0], 1.5), // Move into rainbow image area
      error2Ref().scale(0.2, 1.5),
      error2Ref().position([0, 100], 1.5), // Move into rainbow image area
      error3Ref().scale(0.2, 1.5),
      error3Ref().position([200, -50], 1.5), // Move into rainbow image area
      error2Ref().opacity(0, 1),
      error3Ref().opacity(0, 1),
      error1Ref().opacity(0, 1),
      delay(1, premiereWindowRef().opacity(0, 1.5)),
      // Keep error windows visible (don't fade them out)
    );
  };

  return {
    container,
    animateSequence,
    fadeOutSequence,
    refs: {
      container: containerRef,
      premiereWindow: premiereWindowRef,
      error1: error1Ref,
      error2: error2Ref,
      error3: error3Ref,
    },
  };
}

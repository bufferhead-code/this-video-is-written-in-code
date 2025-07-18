import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition, createSignal } from '@motion-canvas/core';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect } from '@motion-canvas/2d/lib/components';
import { zoomIn } from '../animation';
import { Background } from '../components/Background';
import { COLORS } from '../utils/colors';
import motionCanvasLogo from '../images/motion-canvas-logo.svg';
import { Logo } from '../components/Logo';

export default makeScene2D(function* (view) {
  // --- REFS ---
  const logoRef = createRef<Logo>();

  // --- ELEMENTS ---
  view.add(
    <>
      {/* Fullscreen dark background */}
      <Rect width={'100%'} height={'100%'} fill={COLORS.grayBg} zIndex={-100} />

      {/* Logo with crown */}
      <Logo
        ref={logoRef}
        src={motionCanvasLogo}
        containerSize={300}
        zIndex={100}
        opacity={0}
        scale={0}
        crownSize={100}
        crownRotation={15}
      />
    </>,
  );

  // --- ANIMATION SEQUENCE ---
  yield* fadeTransition(1);

  // 1. Zoom in the logo
  yield* zoomIn(logoRef());
  yield* waitFor(1.0);

  // 2. Show the crown
  yield* logoRef().showCrown(1.0);
  yield* waitFor(2.0);

  // 3. Hide the crown
  yield* logoRef().hideCrown(0.8);
  yield* waitFor(1.0);

  // 4. Show crown again
  yield* logoRef().showCrown(0.6);
  yield* waitFor(2.0);
});

import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect } from '@motion-canvas/2d/lib/components';
import { HexagonLayout } from '../components/HexagonLayout';
import { BlueprintBackground } from '../components/BlueprintBackground';
import { zoomIn, fadeOut } from '../animation';

import motionCanvasLogoDark from '../images/motion-canvas-logo-dark.svg';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Rect>();
  const logoRef = createRef<Img>();
  const hexagonLayoutRef = createRef<HexagonLayout>();

  // Blueprint background
  view.add(
    <Rect
      ref={backgroundRef}
      width={'100%'}
      height={'100%'}
    >
      <BlueprintBackground width={'100%'} height={'100%'} />
    </Rect>
  );

  // Motion Canvas logo
  view.add(
    <Img
      ref={logoRef}
      src={motionCanvasLogoDark}
      width={400}
      height={400}
      scale={0}
      opacity={0}
    />
  );

  // Hexagon layout
  view.add(
    <HexagonLayout
      ref={hexagonLayoutRef}
      hexagonRadius={60}
      hexagonColor={'#333333'}
      hexagonStroke={'#ffffff'}
      hexagonLineWidth={2}
      spacing={30}
      y={200}
    />
  );

  // Animate logo zoom fade in
  yield* zoomIn(logoRef(), {
    duration: 1.5,
    fromScale: 0,
    toScale: 1,
    overshoot: true
  });

  yield* waitFor(0.5);

  // Animate hexagon layout with numbers 1-5
  yield* hexagonLayoutRef().animateIn(0.8, 0.3);

  yield* waitFor(2);

  // Fade out the colored lines (logo)
  yield* fadeOut(logoRef(), {
    duration: 1,
  });

  yield* waitFor(1);
});
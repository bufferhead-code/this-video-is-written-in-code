import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect } from '@motion-canvas/2d/lib/components';
import { PricingPage } from '../components/PricingPage';
import { MacOSBackground } from '../components/MacOSBackground';
import { TenorGifComponent } from '../components/TenorGif';
import { slideInBottom } from '../animation';
import {
  Direction,
  fadeTransition,
  slideTransition,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const pricingPageRef = createRef<Rect>();
  const tenorGifRef = createRef<Rect>();

  view.add(
    <Rect width={'100%'} height={'100%'}>
      <MacOSBackground />

      <PricingPage ref={pricingPageRef} width={1800} y={-120} />

      <TenorGifComponent
        ref={tenorGifRef}
        tenorId="361299607546324637"
        width={300}
        height={225}
        radius={16}
        shadowOffsetY={8}
        x={300}
        y={-250}
        opacity={0}
        scale={0.8}
      />
    </Rect>,
  );

  yield* pricingPageRef().opacity(0, 0);
  yield* fadeTransition(1);

  yield* waitFor(0.5);

  // Start with opacity 0 and slide in from bottom
  yield* slideInBottom(pricingPageRef(), { duration: 0.8, distance: 100 });

  yield* waitUntil('70$');

  yield* waitFor(1); // Let the GIF show for a moment

  // Camera zoom to center left
  yield* all(
    pricingPageRef().scale(2.3, 1),
    pricingPageRef().position([500, -550], 1), // Move content right to focus on center-left area
  );

  yield* waitFor(1);

  // Animate the GIF in with a bounce effect
  yield* all(tenorGifRef().opacity(1, 0.5), tenorGifRef().scale(1.5, 0.8));

  yield* waitFor(1); // End of scene 3 (adjusted for GIF animation)
});

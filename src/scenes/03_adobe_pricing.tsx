import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Txt } from '@motion-canvas/2d/lib/components';
import { PricingPage } from '../components/PricingPage';
import { MacOSBackground } from '../components/MacOSBackground';
import { TextMarker } from '../components/TextMarker';
import { slideInBottom } from '../animation';
import { playZoomIn } from '../soundeffects';
import {
  Direction,
  fadeTransition,
  slideTransition,
} from '@motion-canvas/core';
import { COLORS } from '../utils/colors';

export default  makeScene2D(function* (view) {
  const pricingPageRef = createRef<Rect>();
  const textMarkerRef = createRef<TextMarker>();

  view.add(
    <Rect width={'100%'} height={'100%'}>
      <MacOSBackground />

      <PricingPage ref={pricingPageRef} width={1800} y={-120} />


      <TextMarker
        ref={textMarkerRef}
        width={370}
        height={80}
        x={-610}
        y={-120}
        markerColor={COLORS.secondary}
        markerOpacity={0.5}
        markerThickness={8}
        animationDuration={1.2}
        markerCompositeOperation="darken"
      />
    </Rect>,
  );

  yield* pricingPageRef().opacity(0, 0);
  yield* fadeTransition(1);

  yield* waitUntil('pricing_page_start');

  // Start with opacity 0 and slide in from bottom
  yield* slideInBottom(pricingPageRef(), { duration: 0.8, distance: 100 });


  yield* waitUntil('zoom_start');

  // Camera zoom to center left
  playZoomIn({ duration: 1 });
  yield* all(
    pricingPageRef().scale(2.3, 1),
    pricingPageRef().position([500, -550], 1), // Move content right to focus on center-left area
  );

  yield* waitUntil('text_marker_start');

  // Animate the text marker with pen effect
  yield* textMarkerRef().animateMarkerPen(0);


  yield* waitUntil('scene_end');
});

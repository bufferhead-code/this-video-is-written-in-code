import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Code, Video, Img } from '@motion-canvas/2d/lib/components';
import { fadeTransition } from '@motion-canvas/core';
import { Browser } from '../components/Browser';
import { Logo } from '../components/Logo';
import { CodeCard } from '../components/CodeCard';
import { Background } from '../components/Background';
import { slideInBottom } from '../animation';

import layoutsScreenshot from '../images/layouts_screenshot.jpeg';
import cssLogo from '../images/css-logo.svg';
import moveItVideo from '../images/move_it.mp4';
import { DEFAULT } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Img>();
  const logoRef = createRef<Logo>();
  const browserRef = createRef<Browser>();
  const codeCardRef = createRef<Rect>();
  const codeRef = createRef<Code>();
  const videoRef = createRef<Video>();

  // Background component
  view.add(
    <Background ref={backgroundRef} />
  );

  yield* fadeTransition(1);

  // Logo component - slideInBottom will handle initial positioning
  view.add(
    <Logo
      ref={logoRef}
      src={cssLogo}
      containerSize={500}
      opacity={0}
    />
  );

  // Browser with layouts screenshot - slideInBottom will handle initial positioning
  view.add(
    <Browser
      ref={browserRef}
      url="https://motioncanvas.io/docs/layouts"
      screenshotSrc={layoutsScreenshot}
      width={1700}
      opacity={0}
      y={-50}
    />
  );

  // CodeCard showing Layout code - start with simple Rect
  view.add(
    <CodeCard
      ref={codeCardRef}
      codeRef={codeRef}
      code={`<Rect>
</Rect>`}
      width={800}
      opacity={0}
    />
  );

  // Video component - initially hidden and small
  view.add(
    <Video
      ref={videoRef}
      src={moveItVideo}
      width={400}
      height={300}
      opacity={0}
      scale={0.1}
    />
  );

  // Animation sequence

  // 1. Slide logo in from bottom
  yield* slideInBottom(logoRef());

  yield* waitUntil('cross_out_css');

  // 2. Cross out the logo
  yield* logoRef().crossOut(0.8);

  yield* waitUntil('show_browser');

  // 3. Fade out logo and slide in browser simultaneously
  yield* all(
    logoRef().opacity(0, 0.8),
    slideInBottom(browserRef())
  );

  yield* waitUntil('show_code');

  // 4. Slide in CodeCard and blur browser
  yield* all(
    slideInBottom(codeCardRef()),
    browserRef().filters.blur(10, 0.8)
  );

  yield* waitUntil('add_layout_property');

  // 5. Add layout property to Rect
  yield* codeRef().code.replace(
    codeRef().findFirstRange('<Rect>'),
    '<Rect\n  layout={true}>',
    0.6
  );

  yield* waitUntil('transform_to_layout');

  // 6. Transform Rect to Layout
  yield* all(
    codeRef().code.replace(
      codeRef().findFirstRange('Rect'),
      'Layout',
      0.6
    ),
    codeRef().code.replace(
      codeRef().findFirstRange('</Rect>'),
      '</Layout>',
      0.6
    )
  );

  yield* waitUntil('add_layout_attributes');

  // 7. Add all layout attributes at once
  yield* codeRef().code.replace(
    codeRef().findFirstRange('layout={true}'),
    'layout={true}\n  alignItems={\'center\'}\n  justifyContent={\'center\'}\n  gap={10}\n  direction={\'column\'}',
    0.6
  );

  yield* waitUntil('highlight_alignItems');

  // 8. Highlight alignItems
  const alignItemsRange = codeRef().findFirstRange("alignItems={'center'}");
  yield* codeRef().selection(alignItemsRange, 0.5);
  yield* waitUntil('highlight_justifyContent');

  // 9. Highlight justifyContent
  const justifyContentRange = codeRef().findFirstRange("justifyContent={'center'}");
  yield* codeRef().selection(justifyContentRange, 0.5);
  yield* waitUntil('highlight_gap');

  // 10. Highlight gap
  const gapRange = codeRef().findFirstRange('gap={10}');
  yield* codeRef().selection(gapRange, 0.5);
  yield* waitUntil('highlight_direction');

  // 11. Highlight direction
  const directionRange = codeRef().findFirstRange("direction={'column'}");
  yield* codeRef().selection(directionRange, 0.5);

  yield* waitUntil('clear_selection');

  // Clear selection
  yield* codeRef().selection(DEFAULT, 0.3);

  yield* waitUntil('scene_end');
});
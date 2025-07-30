import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Code, Video, Img } from '@motion-canvas/2d/lib/components';
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

  // CodeCard showing Layout code
  view.add(
    <CodeCard
      ref={codeCardRef}
      codeRef={codeRef}
      code={`<Layout
  alignItems={'center'}
  justifyContent={'center'}
  gap={10}
  direction={'column'}
>
</Layout>`}
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

  yield* waitFor(1);

  // 2. Cross out the logo
  yield* logoRef().crossOut(0.8);

  yield* waitFor(0.5);

  // 3. Fade out logo and slide in browser simultaneously
  yield* all(
    logoRef().opacity(0, 0.8),
    slideInBottom(browserRef())
  );

  yield* waitFor(1);

  // 4. Slide in CodeCard and blur browser
  yield* all(
    slideInBottom(codeCardRef()),
    browserRef().filters.blur(10, 0.8)
  );

  yield* waitFor(1);

  // 5. Highlight attributes one by one
  // Highlight alignItems with value
  const alignItemsRange = codeRef().findFirstRange("alignItems={'center'}");
  yield* codeRef().selection(alignItemsRange, 0.5);
  yield* waitFor(1);

  // Highlight justifyContent with value
  const justifyContentRange = codeRef().findFirstRange("justifyContent={'center'}");
  yield* codeRef().selection(justifyContentRange, 0.5);
  yield* waitFor(1);

  // Highlight gap with value
  const gapRange = codeRef().findFirstRange('gap={10}');
  yield* codeRef().selection(gapRange, 0.5);
  yield* waitFor(1);

  // Highlight direction with value
  const directionRange = codeRef().findFirstRange("direction={'column'}");
  yield* codeRef().selection(directionRange, 0.5);
  yield* waitFor(1);

  // Clear selection
  yield* codeRef().selection(DEFAULT, 0.3);

  yield* waitFor(1);

  // 6. Unblur browser
  yield* browserRef().filters.blur(0, 0.8);

  yield* waitFor(1);

  // 7. Fade out browser and codecard, zoom in video
  yield* all(
    browserRef().opacity(0, 0.8),
    codeCardRef().opacity(0, 0.8),
    videoRef().opacity(1, 0.8),
    videoRef().scale(1, 1.2)
  );

  yield* waitFor(2);
});
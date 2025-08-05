import { makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img } from '@motion-canvas/2d/lib/components';
import { slideInBottom } from '../animation';
import { MacOSBackground } from '../components/MacOSBackground';
import cursorScreenshot from '../images/cursor_screenshot.png?url';
import { fadeTransition, waitUntil } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Create references
  const backgroundRef = createRef<MacOSBackground>();
  const screenshotRef = createRef<Img>();

  // Add MacOS background
  view.add(
    <MacOSBackground
      ref={backgroundRef}
      showMenuBar={false}
      showDock={false}
    />
  );

  yield* fadeTransition(1);

  // Add cursor screenshot image
  const screenshot = (
    <Img
      ref={screenshotRef}
      src={cursorScreenshot}
      width={() => view.width() * 0.95} // 95% of view width
      position={[0, 0]} // Will be animated by slideInBottom
      opacity={0} // Start invisible
    />
  );
  view.add(screenshot);

  // Animate the screenshot sliding in from bottom
  yield* slideInBottom(screenshotRef(), {
    distance: 300,
  });

  yield* waitUntil('scene_end');
}); 
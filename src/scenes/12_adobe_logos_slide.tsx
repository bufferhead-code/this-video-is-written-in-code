import { makeScene2D } from '@motion-canvas/2d';
import { all, delay, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect } from '@motion-canvas/2d/lib/components';
import { slideInBottom } from '../animation';
import { easeInOutSine } from '@motion-canvas/core/lib/tweening';

import premiereProLogo from '../images/premiere-pro-logo.svg';
import afterEffectsLogo from '../images/after-effects-logo.svg';
import screenIcon from '../components/media/screen.svg';
import { fadeTransition } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const containerRef = createRef<Rect>();
  const premiereRef = createRef<Img>();
  const afterEffectsRef = createRef<Img>();
  const leftScreenRef = createRef<Img>();
  const rightScreenRef = createRef<Img>();

  // Create main container
  view.add(
    <Rect
      ref={containerRef}
      width={'100%'}
      height={'100%'}
      fill={'#1a1a1a'}
    >
      {/* Left Screen Background */}
      <Img
        ref={leftScreenRef}
        src={screenIcon}
        width={'40%'}
        position={[-450, 0]}
        opacity={0.3}
      />
      
      {/* Right Screen Background */}
      <Img
        ref={rightScreenRef}
        src={screenIcon}
        width={'40%'}
        position={[450, 0]}
        opacity={0.3}
      />
      
      {/* Premiere Pro Logo */}
      <Img
        ref={premiereRef}
        src={premiereProLogo}
        width={250}
        height={250}
        position={[-120, 0]}
        rotation={-15}
        scale={1.2}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.5)'}
        shadowBlur={20}
        shadowOffset={[10, 10]}
      />
      
      {/* After Effects Logo */}
      <Img
        ref={afterEffectsRef}
        src={afterEffectsLogo}
        width={250}
        height={250}
        position={[120, 0]}
        scale={1.2}
        rotation={15}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.5)'}
        shadowBlur={20}
        shadowOffset={[10, 10]}
      />
    </Rect>
  );


  yield* fadeTransition(1);
  // Wait for the scene to start
  yield* waitUntil('logos_slide_start');

  // Slide in Premiere Pro logo first
  yield* slideInBottom(premiereRef(), {
    duration: 0.6,
    distance: 300,
    overshoot: true
  });

  // Wait a bit, then slide in After Effects logo
  yield* waitFor(0.3);
  
  yield* slideInBottom(afterEffectsRef(), {
    duration: 0.6,
    distance: 300,
    overshoot: true
  });

  // Hold the final position
  yield* waitUntil('logos_hold');



  // move the premiere pro logo to the left and scale it down all the time
  yield* all(
    premiereRef().position([-450, 0], 0.8, easeInOutSine),
    premiereRef().scale(0.8, 0.8, easeInOutSine),
    premiereRef().rotation(0, 0.8, easeInOutSine),
    // and also for the after effects logo
    afterEffectsRef().position([450, 0], 0.8, easeInOutSine),
    afterEffectsRef().scale(0.8, 0.8, easeInOutSine),
    afterEffectsRef().rotation(0, 0.8, easeInOutSine)
  );
  

  yield* waitUntil('scene_end');
});
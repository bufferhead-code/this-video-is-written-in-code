import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect, Circle, Txt } from '@motion-canvas/2d/lib/components';
import { fadeTransition } from '@motion-canvas/core';
import { HexagonLayout } from '../components/HexagonLayout';
import { StyledText } from '../components/StyledText';
import { zoomIn, fadeOut } from '../animation';
import { playZoomIn } from '../soundeffects';

import motionCanvasLogoColored from '../images/motion-canvas-logo-colored.svg';
import motionCanvasLogoWhite from '../images/motion-canvas-logo-white.svg';
import animationIcon from '../images/animation-icon.svg';

export default makeScene2D(function* (view) {
  const backgroundRef = createRef<Rect>();
  const logoColoredRef = createRef<Img>();
  const logoWhiteRef = createRef<Img>();
  const hexagonLayoutRef = createRef<HexagonLayout>();
  const circleRefs = Array.from({ length: 5 }, () => createRef<Circle>());
  const numberRefs = Array.from({ length: 5 }, () => createRef<Txt>());
  const animationTextRef = createRef<StyledText>();
  const animationIconRef = createRef<Img>();

  // Dark gray background
  view.add(
    <Rect
      ref={backgroundRef}
      width={'100%'}
      height={'100%'}
      fill={'#171717'}
    />
  );

  yield* fadeTransition(1);

  // Motion Canvas logo - colored parts
  view.add(
    <Img
      ref={logoColoredRef}
      src={motionCanvasLogoColored}
      width={400}
      height={400}
      scale={0}
      opacity={0}
    />
  );

  // Motion Canvas logo - white parts
  view.add(
    <Img
      ref={logoWhiteRef}
      src={motionCanvasLogoWhite}
      width={400}
      height={400}
      scale={0}
      opacity={0}
    />
  );

  // Add HexagonLayout component
  view.add(
    <HexagonLayout
      ref={hexagonLayoutRef}
      spacing={350}
      rotation={25}
    />
  );

  // Get positions from layout
  const positions = hexagonLayoutRef().getPositions();
  
  for (let i = 0; i < 5; i++) {
    // Create circle
    view.add(
      <Circle
        ref={circleRefs[i]}
        width={120}
        height={120}
        fill={'#333333'}
        lineWidth={2}
        position={[positions[i].x, positions[i].y]}
        scale={0}
        opacity={0}
      />
    );
    
    // Create number text
    view.add(
      <Txt
        ref={numberRefs[i]}
        text={(i + 1).toString()}
        fontSize={48}
        fill={'#ffffff'}
        fontWeight={600}
        position={[positions[i].x, positions[i].y]}
        scale={0}
        opacity={0}
      />
    );
  }

  // Add "Animation" text (initially hidden)
  view.add(
    <StyledText
      ref={animationTextRef}
      colorType="black"
      size="lg"
      position={[positions[2].x + 320, positions[2].y]}
      opacity={0}
    />
  );

  // Add animation icon (initially hidden)
  view.add(
    <Img
      ref={animationIconRef}
      src={animationIcon}
      width={80}
      height={80}
      position={[positions[2].x, positions[2].y]}
      scale={0}
      opacity={0}
    />
  );


  yield* waitUntil('start_logo_fade');

  // Animate both logo parts zoom fade in together
  yield* all(
    zoomIn(logoColoredRef(), {
      duration: 0.7,
      fromScale: 0,
      toScale: 1,
    }),
    zoomIn(logoWhiteRef(), {
      duration: 0.7,
      fromScale: 0,
      toScale: 1,
    })
  );

  yield* waitUntil('logo_fade_start');

  // Fade out only the colored parts of the logo
  yield* fadeOut(logoColoredRef(), {
    duration: 0.5,
  });

  yield* waitUntil('logo_scale_up');

  // scale up the white parts of the logo and move it to the center of the screen
  yield* all(
    logoWhiteRef().position([-115, -115], 0.5),
    logoWhiteRef().scale(2.5, 0.5),
  );

  yield* waitUntil('show_numbers');

  // Animate circles and numbers appearing one by one
  for (let i = 0; i < 5; i++) {
    yield* all(
      zoomIn(circleRefs[i](), {
        duration: 0.2,
        fromScale: 0,
        toScale: 1,
        overshoot: true
      }),
      zoomIn(numberRefs[i](), {
        duration: 0.2,
        fromScale: 0,
        toScale: 1,
        overshoot: true
      })
    );
    
  }

  yield* waitUntil('zoom_to_animation');

  // Zoom into third circle (index 2) for "Animation"
  playZoomIn({ duration: 1.5 });
  yield* all(
    view.scale(2.8, 1.5),
    view.position([positions[2].x, positions[2].y * -1], 1.5),
    animationTextRef().opacity(1, 1.5)
  );

  // Start typewriter effect after zoom completes
  yield* animationTextRef().typewrite("Animation", 0.5);

  // Fade out number 3 and zoom in animation icon
  yield* fadeOut(numberRefs[2](), {
    duration: 0.8,
  });

  yield* all(
    zoomIn(animationIconRef(), {
      fromScale: 0,
      toScale: 1,
      overshoot: true
    })
  );

  yield* waitUntil('scene_end');
});
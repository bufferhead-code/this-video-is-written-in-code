import { makeScene2D } from '@motion-canvas/2d';
import { waitFor, waitUntil, all, fadeTransition } from '@motion-canvas/core';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Circle, Txt } from '@motion-canvas/2d/lib/components';
import { HexagonLayout } from '../components/HexagonLayout';
import { StyledText } from '../components/StyledText';
import { fadeOut, fadeIn, zoomIn } from '../animation';
import { COLORS } from '../utils/colors';  
import motionCanvasLogoWhite from '../images/motion-canvas-logo-white.svg';
import timeEventsIcon from '../images/time-events-icon.svg';

export default makeScene2D(function* (view) {
  // Set gray background
  view.fill(COLORS.grayBg);

  // Create refs for hexagon animation
  const logoWhiteRef = createRef<Img>();
  const hexagonLayoutRef = createRef<HexagonLayout>();
  const circleRefs = Array.from({ length: 5 }, () => createRef<Circle>());
  const numberRefs = Array.from({ length: 5 }, () => createRef<Txt>());
  const timeEventsTextRef = createRef<StyledText>();
  const timeEventsIconRef = createRef<Img>();

  // Motion Canvas logo - white parts
  view.add(
    <Img
      ref={logoWhiteRef}
      src={motionCanvasLogoWhite}
      width={400}
      height={400}
      scale={2.5}
      position={[-115, -115]}
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
  
  // Create circles and numbers
  for (let i = 0; i < 5; i++) {
    view.add(
      <Circle
        ref={circleRefs[i]}
        width={120}
        height={120}
        fill={'#333333'}
        lineWidth={2}
        position={[positions[i].x, positions[i].y]}
      />
    );
    
    view.add(
      <Txt
        ref={numberRefs[i]}
        text={(i + 1).toString()}
        fontSize={48}
        fill={'#ffffff'}
        fontWeight={600}
        position={[positions[i].x, positions[i].y]}
      />
    );
  }

  // Create StyledText instance for "Time Events" (initially hidden)
  const timeEventsText = new StyledText({
    colorType: "black",
    size: "lg",
    position: [positions[4].x - 360, positions[4].y], // 5th point is index 4
    opacity: 0,
  });
  timeEventsTextRef(timeEventsText);
  view.add(timeEventsText);

  // Add time events icon (initially hidden)
  view.add(
    <Img
      ref={timeEventsIconRef}
      src={timeEventsIcon}
      width={80}
      height={80}
      position={[positions[4].x, positions[4].y]} // 5th point is index 4
      scale={0}
      opacity={0}
    />
  );

  yield* fadeTransition(0.5);

  // Wait for a moment
  yield* waitUntil('zoom_to_time_events');

  // Zoom into fifth circle (index 4) for "Time Events" - top left position
  yield* all(
    view.scale(2.5, 1.5),
    view.position([positions[4].x * -9, positions[4].y + 1400], 1.5),
    timeEventsTextRef().opacity(1, 1.5)
  );

  // Start typewriter effect after zoom completes
  yield* timeEventsTextRef().typewrite("Time Events", 0.5);

  // Fade out number 5 and zoom in time events icon
  yield* fadeOut(numberRefs[4](), {
    duration: 0.8,
  });

  yield* all(
    zoomIn(timeEventsIconRef(), {
      fromScale: 0,
      toScale: 1,
      overshoot: true
    })
  );

  yield* waitUntil('end');

});
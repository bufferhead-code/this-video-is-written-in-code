import { makeScene2D } from '@motion-canvas/2d';
import { waitFor, all, delay, waitUntil } from '@motion-canvas/core';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Img, Rect, Circle, Txt } from '@motion-canvas/2d/lib/components';
import { Browser } from '../components/Browser';
import { CodeCard } from '../components/CodeCard';
import { HexagonLayout } from '../components/HexagonLayout';
import { StyledText } from '../components/StyledText';
import { slideInBottom, fadeOut, fadeIn, zoomIn } from '../animation';
import { COLORS } from '../utils/colors';  
import motionCanvasDocs from '../images/motion_canvas_docs_rect.jpeg';
import motionCanvasLogoColored from '../images/motion-canvas-logo-colored.svg';
import motionCanvasLogoWhite from '../images/motion-canvas-logo-white.svg';
import scenesIcon from '../images/scenes-icon.svg';

export default makeScene2D(function* (view) {
  // Set gray background
  view.fill(COLORS.grayBg);

  // Create browser with Motion Canvas docs image
  const browser = new Browser({
    width: 1800,
    height: 600,
    screenshotSrc: motionCanvasDocs,
    url: 'https://motioncanvas.io/docs/',
    position: [0, -180],
  });

  // Create CodeCard with signal code
  const codeCard = (
    <CodeCard
      code={`const signal = createSignal(0);`}
      position={[0, 0]}
      opacity={0}
    />
  );

  // Create refs for hexagon animation
  const logoColoredRef = createRef<Img>();
  const logoWhiteRef = createRef<Img>();
  const hexagonLayoutRef = createRef<HexagonLayout>();
  const circleRefs = Array.from({ length: 5 }, () => createRef<Circle>());
  const numberRefs = Array.from({ length: 5 }, () => createRef<Txt>());
  const signalsTextRef = createRef<StyledText>();
  const signalsIconRef = createRef<Img>();

  view.add(browser);
  view.add(codeCard);

  // Motion Canvas logo - colored parts (initially hidden)
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

  // Motion Canvas logo - white parts (initially hidden)
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

  // Add HexagonLayout component (initially hidden)
  view.add(
    <HexagonLayout
      ref={hexagonLayoutRef}
      spacing={350}
      rotation={25}
    />
  );

  // Get positions from layout
  const positions = hexagonLayoutRef().getPositions();
  
  // Create circles and numbers (initially hidden)
  for (let i = 0; i < 5; i++) {
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

  // Create StyledText instance for "Signals" (initially hidden)
  const signalsText = new StyledText({
    colorType: "black",
    size: "lg",
    position: [positions[3].x - 270, positions[3].y],
    opacity: 0,
  });
  signalsTextRef(signalsText);
  view.add(signalsText);

  // Add signals icon (initially hidden)
  view.add(
    <Img
      ref={signalsIconRef}
      src={scenesIcon}
      width={80}
      height={80}
      position={[positions[3].x, positions[3].y]}
      scale={0}
      opacity={0}
    />
  );

  // Slide in browser from bottom
  yield* slideInBottom(browser, { duration: 1, distance: 300 });

  // Wait for a second
  yield* waitFor(1);

  // Fade out browser
  yield* all(
    browser.position([0, -10000], 2.5),
    delay(1, fadeOut(browser, { duration: 1 }))
  );

  yield* waitFor(0.5);

  // Show both logo parts appearing together
  yield* all(
    zoomIn(logoColoredRef(), {
      duration: 1.5,
      fromScale: 0,
      toScale: 1,
      overshoot: true
    }),
    zoomIn(logoWhiteRef(), {
      duration: 1.5,
      fromScale: 0,
      toScale: 1,
      overshoot: true
    })
  );

  yield* waitFor(0.5);

  // Fade out only the colored parts of the logo
  yield* fadeOut(logoColoredRef(), {
    duration: 1,
  });

  yield* waitFor(1);

  // Move white logo to top-left and scale up
  yield* all(
    logoWhiteRef().position([-115, -115], 1),
    logoWhiteRef().scale(2.5, 1),
  );

  yield* waitFor(0.5);

  yield* waitUntil('event');

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

  yield* waitFor(1);

  // Zoom into fourth circle (index 3) for "Signals"
  yield* all(
    view.scale(3, 1.5),
    view.position([positions[3].x * -8, positions[3].y - 100], 1.5),
    signalsTextRef().opacity(1, 1.5)
  );

  // Start typewriter effect after zoom completes
  yield* signalsTextRef().typewrite("Signals", 0.5);

  // Fade out number 4 and zoom in signals icon
  yield* fadeOut(numberRefs[3](), {
    duration: 0.8,
  });

  yield* all(
    zoomIn(signalsIconRef(), {
      fromScale: 0,
      toScale: 1,
      overshoot: true
    })
  );

  yield* waitFor(2);

});
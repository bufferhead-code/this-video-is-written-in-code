import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Txt, Node } from '@motion-canvas/2d/lib/components';
import { waitFor, all, loop } from '@motion-canvas/core/lib/flow';
import { tween, easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { createRef } from '@motion-canvas/core/lib/utils';
import { COLORS } from '../utils/colors';

export default makeScene2D(function* (view) {
  // Create references for the loading bars
  const loadingBar1 = createRef<Rect>();
  const loadingBar2 = createRef<Rect>();
  const titleText = createRef<Txt>();
  const label1 = createRef<Txt>();
  const label2 = createRef<Txt>();
  const time1 = createRef<Txt>();
  const time2 = createRef<Txt>();

  // Add black background
  view.add(<Rect width="100%" height="100%" fill="#000000" />);

  // Add title text
  view.add(
    <Txt
      ref={titleText}
      text="Estimate until completion"
      fontSize={48}
      fill="#FFFFFF"
      fontFamily="Arial, sans-serif"
      fontWeight={700}
      y={-150}
      textAlign="center"
    />,
  );

  // Container for the loading bars
  view.add(
    <Node>
      {/* First loading bar section */}
      <Node y={-80}>
        <Txt
          ref={label1}
          text="Do task manually"
          fontSize={24}
          fill="#FFFFFF"
          fontFamily="Arial, sans-serif"
          fontWeight={600}
          x={-200}
          y={-30}
          textAlign="left"
        />
        <Txt
          ref={time1}
          text="10 minutes"
          fontSize={18}
          fill="#CCCCCC"
          fontFamily="Arial, sans-serif"
          x={200}
          y={-30}
          textAlign="right"
        />
        {/* First loading bar container */}
        <Rect
          x={0}
          y={0}
          width={600}
          height={30}
          fill="#333333"
          stroke="#666666"
          lineWidth={2}
          radius={15}
        />
        {/* First loading bar fill */}
        <Rect
          ref={loadingBar1}
          x={-300}
          y={0}
          width={0}
          height={30}
          fill={COLORS.primary}
          radius={15}
        />
      </Node>

      {/* Second loading bar section */}
      <Node y={80}>
        <Txt
          ref={label2}
          text="Create automation"
          fontSize={24}
          fill="#FFFFFF"
          fontFamily="Arial, sans-serif"
          fontWeight={600}
          x={-200}
          y={-30}
          textAlign="left"
        />
        <Txt
          ref={time2}
          text="20 hours"
          fontSize={18}
          fill="#CCCCCC"
          fontFamily="Arial, sans-serif"
          x={200}
          y={-30}
          textAlign="right"
        />
        {/* Second loading bar container */}
        <Rect
          x={0}
          y={0}
          width={600}
          height={30}
          fill="#333333"
          stroke="#666666"
          lineWidth={2}
          radius={15}
        />
        {/* Second loading bar fill */}
        <Rect
          ref={loadingBar2}
          x={-300}
          y={0}
          width={0}
          height={30}
          fill={COLORS.secondary}
          radius={15}
        />
      </Node>
    </Node>,
  );

  // Wait a moment before starting the animation
  yield* waitFor(0.5);

  // Animate the title text fade in
  yield* tween(0.8, (value) => {
    titleText().opacity(value);
  });

  yield* waitFor(0.5);

  // Animate both loading bars simultaneously with pulse effect
  yield* all(
    // Pulse effect animation
    loop(
      4,
      () => tween(1, (value) => {
        const opacity = 0.7 + Math.sin(value * Math.PI * 2) * 0.3;
        loadingBar1().opacity(opacity);
        loadingBar2().opacity(opacity);
      })
    ),
    // Loading bar fill animation
    tween(4, (value) => {
      // First bar fills faster (10 minutes)
      const progress1 = easeInOutCubic(Math.min(value * 1.5, 1));
      loadingBar1().width(600 * progress1);

      // Second bar fills much slower (20 hours)
      const progress2 = easeInOutCubic(Math.min(value * 0.3, 1));
      loadingBar2().width(600 * progress2);
    })
  );

  // Reset opacity to full when complete
  loadingBar1().opacity(1);
  loadingBar2().opacity(1);

  // Wait for a moment to show completed bars
  yield* waitFor(1);

  // Optional: Add a completion effect
  yield* tween(0.5, (value) => {
    const scale = 1 + value * 0.1;
    loadingBar1().scale(scale);
    loadingBar2().scale(scale);
  });

  yield* tween(0.5, (value) => {
    const scale = 1.1 - value * 0.1;
    loadingBar1().scale(scale);
    loadingBar2().scale(scale);
  });

  // Hold the final state
  yield* waitFor(1);
});

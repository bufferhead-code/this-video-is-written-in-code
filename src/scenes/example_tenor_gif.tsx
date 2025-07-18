import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Txt } from '@motion-canvas/2d/lib/components';
import { TenorGif, TenorGifComponent } from '../components/TenorGif';
import { slideInBottom } from '../animation';

export default makeScene2D(function* (view) {
  const gifRef = createRef<TenorGif>();
  const titleRef = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="center" gap={60}>
      {/* Title */}
      <Txt
        ref={titleRef}
        text="TenorGif Component Demo"
        fontSize={48}
        fontWeight={700}
        fill="#ffffff"
        fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif"
        y={-300}
      />

      {/* Function Component Example */}
      <TenorGifComponent
        tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
        width={400}
        height={300}
        radius={16}
        shadowOffsetY={8}
        y={-50}
      />

      {/* Class Component Example with Animation */}
      <TenorGif
        ref={gifRef}
        tenorUrl="https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637"
        width={300}
        height={225}
        radius={12}
        shadowOffsetY={10}
        y={200}
      />
    </Layout>,
  );

  // Background
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      zIndex={-1}
    />,
  );

  // Animation sequence
  yield* titleRef().opacity(0, 0);
  yield* gifRef().opacity(0, 0);

  // Animate title in
  yield* slideInBottom(titleRef(), { duration: 1, distance: 50 });

  yield* waitFor(0.5);

  // Animate the class component GIF
  yield* gifRef().animateIn(1.2);

  yield* waitFor(2);

  // Scale animation
  yield* all(gifRef().width(450, 1), gifRef().height(338, 1));

  yield* waitFor(1.5);

  // Change shadow color
  yield* gifRef().shadowColor('rgba(100, 255, 100, 0.5)', 1);

  yield* waitFor(2);

  // Animate out
  yield* gifRef().animateOut(0.8);

  yield* waitFor(1);
});

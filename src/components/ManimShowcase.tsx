import { makeScene2D } from '@motion-canvas/2d';
import { Circle, Line, Rect, RectProps } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { Vector2 } from '@motion-canvas/core/lib/types';

export const ManimShowcase = (props: RectProps) => {
  const circleRef = createRef<Circle>();
  const lineRef = createRef<Line>();

  return (
    <Rect width={'100%'} height={'100%'} fill={'#242424'} {...props}>
      <Circle ref={circleRef} size={100} fill={'#FF6464'} x={-500} />
      <Line
        ref={lineRef}
        points={[
          new Vector2(-600, 0),
          new Vector2(-400, 0),
          new Vector2(-200, 0),
          new Vector2(0, 0),
          new Vector2(200, 0),
          new Vector2(400, 0),
          new Vector2(600, 0),
        ]}
        stroke={'#64FF64'}
        lineWidth={10}
      />
    </Rect>
  );
};

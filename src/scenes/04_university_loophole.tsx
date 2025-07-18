import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect } from '@motion-canvas/2d/lib/components';
import { UniversityImage } from '../components/UniversityImage';
import { Stamp } from '../components/Stamp';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const stampRef = createRef<Rect>();

  view.add(
    <Rect ref={sceneRef} opacity={0} width={'100%'} height={'100%'}>
      <UniversityImage width={'100%'} height={'100%'} />
      <Stamp ref={stampRef} text={'NO ACTIVITY'} opacity={0} />
    </Rect>,
  );

  yield* waitFor(0); // Start of scene 4
  yield* sceneRef().opacity(1, 0.5);

  yield* waitUntil('no activity'); // When "no activity" is mentioned
  yield* stampRef().opacity(1, 0.5);

  yield* waitUntil('end_scene_4'); // End of scene 4
  yield* sceneRef().opacity(0, 0.5);
});

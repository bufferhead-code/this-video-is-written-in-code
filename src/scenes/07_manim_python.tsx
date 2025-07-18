import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Txt, SVG } from '@motion-canvas/2d/lib/components';
import { ManimShowcase } from '../components/ManimShowcase';
import { PythonLogo } from '../components/PythonLogo';
import { BrainIcon } from '../components/BrainIcon';

export default makeScene2D(function* (view) {
  const sceneRef = createRef<Rect>();
  const manimShowcaseRef = createRef<Rect>();
  const pythonLogoRef = createRef<Rect>();
  const noSymbolRef = createRef<Rect>();
  const brainIconRef = createRef<Rect>();

  view.add(
    <Rect
      ref={sceneRef}
      opacity={0}
      width={'100%'}
      height={'100%'}
      fill={'#242424'}
    >
      <ManimShowcase ref={manimShowcaseRef} opacity={0} />
      <PythonLogo ref={pythonLogoRef} opacity={0} width={200} height={200} />
      <Rect
        ref={noSymbolRef}
        opacity={0}
        width={250}
        height={250}
        radius={125}
        stroke={'red'}
        lineWidth={20}
      >
        <Rect width={200} height={20} rotation={-45} fill={'red'} />
      </Rect>
      <BrainIcon ref={brainIconRef} opacity={0} width={200} height={200} />
    </Rect>,
  );

  yield* waitFor(0); // Start of scene 7
  yield* sceneRef().opacity(1, 0.5);

  yield* waitUntil('manim_mentioned'); // When "Manim" is mentioned
  yield* manimShowcaseRef().opacity(1, 0.5);

  yield* waitUntil('written_in_python'); // When "written in Python" is mentioned
  yield* all(
    manimShowcaseRef().opacity(0, 0.5),
    pythonLogoRef().opacity(1, 0.5),
    noSymbolRef().opacity(1, 0.5),
  );

  yield* waitUntil('python_for_me'); // When "that's Python for me" is mentioned
  yield* all(
    pythonLogoRef().opacity(0, 0.5),
    noSymbolRef().opacity(0, 0.5),
    brainIconRef().opacity(1, 0.5),
  );

  yield* waitUntil('sacrifice_sanity'); // When "sacrifice your sanity" is mentioned
  yield* brainIconRef().scale(2, 0.2).to(0, 0.2); // Explode animation

  yield* waitUntil('end_scene_7'); // End of scene 7
  yield* sceneRef().opacity(0, 0.5);
});

import { makeScene2D } from '@motion-canvas/2d';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Rect, Code } from '@motion-canvas/2d/lib/components';
import { StyledText } from '../components/StyledText';
import { CodeCard } from '../components/CodeCard';
import { BufferheadCharacter } from '../components/BufferheadCharacter';
import { slideInBottom, zoomIn } from '../animation';
import { RedArrowWithText } from '../components/RedArrowWithText';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { Background } from '../components/Background';

export default makeScene2D(function* (view) {
  const codeCardRef = createRef<Rect>();
  const codeRef = createRef<Code>();
  const generatorsTextRef = createRef<StyledText>();
  const bufferheadRef = createRef<any>();
  const arrowWithTextRef = createRef<RedArrowWithText>();

  // Add background
  view.add(<Background />);

  // Add CodeCard with yield statements (initially hidden)
  view.add(
    <CodeCard
      ref={codeCardRef}
      code={`yield* rect().position.x(300, 1);\nyield* waitFor(1);\nyield* rect().position.x(-300, 1);`}
      codeRef={codeRef}
      position={[0, 0]}
      opacity={0}
      scale={1.5}
    />
  );

  // Add "Generators" text (initially hidden)
  view.add(
    <StyledText
      ref={generatorsTextRef}
      colorType="black"
      
      size="lg"
      position={[0, 600]}
      opacity={0}
    />
  );

  // Add BufferheadCharacter (initially hidden)
  view.add(
    <BufferheadCharacter
      ref={bufferheadRef}
      width={250}
      position={[500, 50]}
      opacity={0}
      scale={1.6}
    />
  );


  // Add RedArrowWithText (initially hidden)
  view.add(
    <RedArrowWithText
      ref={arrowWithTextRef}
      textColorType="red"
      arrowOpacity={0}
      opacity={1}
      x={-50}
      y={-50}
    />
  );

  yield* waitFor(1);

  // Slide in CodeCard from bottom
  yield* slideInBottom(codeCardRef(), {
    overshoot: true
  });

  yield* waitFor(0.5);

  // Highlight all yield statements
  yield* codeRef().selection(codeRef().findAllRanges(/yield\*/g), 0.8);

  yield* waitFor(1);

  // Show "Generators" text with typewriter
  yield* generatorsTextRef().opacity(1, 0.5);
  yield* generatorsTextRef().typewrite("Generators", 0.5);

  yield* waitFor(1);

  // Slide in BufferheadCharacter from bottom
  yield* slideInBottom(bufferheadRef(), {
    overshoot: true
  });

  yield* waitFor(0.5);

  // Show "clueless" text with arrow
  yield* arrowWithTextRef().scaleIn(1.5);
  yield* arrowWithTextRef().typewrite("CLUELESS", 0.5);

  yield* waitFor(3);
}); 
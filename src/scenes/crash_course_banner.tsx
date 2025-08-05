import { Code, Img, makeScene2D } from '@motion-canvas/2d';
import { Rect, Txt, Path, Layout } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { StyledText } from '../components/StyledText';
import { CodeCard } from '../components/CodeCard';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import banner from '../images/banner.svg';
import filmTape from '../images/film_tape.svg';
import { all, DEFAULT, fadeTransition, waitUntil } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const containerRef = createRef<Rect>();
  const textRef = createRef<StyledText>();
  const layoutRef = createRef<Layout>();
  const backgroundRef = createRef<Rect>();
  const bannerRef = createRef<Img>();
  const generatorTextRef = createRef<StyledText>();
  const columnLayoutRef = createRef<any>();
  const codeCard1Ref = createRef<any>();
  const codeCard2Ref = createRef<any>();
  const filmTapeRef = createRef<Img>();
  // Add refs for the 5 Code components on the film tape
  const codeRefs = Array.from({ length: 5 }, () => createRef<Code>());
  view.add(
    <>
        <Rect
      ref={backgroundRef}
      width={'100%'}
      height={'100%'}
      fill={'#171717'}
    />

    <Layout 
      ref={layoutRef}
      direction="column"
      alignItems="center"
      justifyContent="center"
      width={'100%'}
    >
      
    <Rect
      ref={containerRef}
      width={879}
      y={-380}
      height={180}
    >
      <Img
        src={banner}
        height={150}
        ref={bannerRef}
        opacity={0}
        layout={true}
      />
      <StyledText
        ref={textRef}
        strokeWidth={0}
        colorType="white"
        size="lg"
        position={[0, 0]}
      />
          <StyledText
          colorType="secondary"
          size="2xl"
          ref={generatorTextRef}
          y={400}
      />

    </Rect>
    <Img
      src={filmTape}
      ref={filmTapeRef}
      width={1700}
      y={100}
      layout={true}
      opacity={0}
    >
      <Layout
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={170}
        paddingLeft={80}
      >   
      {/* Programmatically render 5 Code components */}
      {codeRefs.map((ref, i) => (
        <Code
          key={String(i)}
          ref={ref}
          code="yield;"
          width={100}
          height={100}
          opacity={0}
        />
      ))}
      </Layout>
      </Img>
    <Rect>
      <DynamicColumnLayout
        width={1700}
        ref={columnLayoutRef}
        layout
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={60}
      />

    </Rect>
    </Layout>
    </>
  );

  yield* fadeTransition(1);

  yield* bannerRef().opacity(1, 0.5);

  yield* textRef().typewrite("CRASH COURSE", 0.5);

  // Center the Generator text on the screen
  yield* generatorTextRef().typewrite("GENERATORS", 0.5);

  yield* waitUntil('center_generator');
  yield* all(
    generatorTextRef().position([0, 85], 0.5),
    generatorTextRef().scale(0.4, 0.5),
  );

  // Slide in the code card column from the bottom
  columnLayoutRef().position([0, 400]);
  columnLayoutRef().opacity(0);
  yield* columnLayoutRef().opacity(1, 0.2);
  yield* columnLayoutRef().position.y(100, 0.7);

  // Programmatically add both CodeCards to the DynamicColumnLayout
  const code1 = `function* generator(i) {\n  yield i;\n  yield i + 10;\n}`;
  const code2 = `const gen = generator(10);\n\ngen.next().value;\n// Expected value: 10\n\ngen.next().value;\n// Expected value: 20`;
  const codeCardCode1Ref = createRef<Code>();
  const codeCard2CodeRef = createRef<Code>();
  const codeCard1 = (
    <CodeCard
      ref={codeCard1Ref}
      codeRef={codeCardCode1Ref}
      code={code1}
    />
  );
  const codeCard2 = (
    <CodeCard
      ref={codeCard2Ref}
      codeRef={codeCard2CodeRef}
      code={code2}

    />
  );
  yield* columnLayoutRef().addItem(codeCard1, 700);
  yield* waitUntil('highlight_function_star');

  // highlight function*
  const functionStarRange = codeCardCode1Ref().findFirstRange('function*');
  yield* codeCardCode1Ref().selection(functionStarRange, 0.5);

  yield* waitUntil('highlight_yields');

  // highlight yields 
  const yieldRanges = codeCardCode1Ref().findAllRanges('yield');
  yield* codeCardCode1Ref().selection(yieldRanges, 0.5);

  yield* waitUntil('reset_selection');

  // reset to default
  yield* codeCardCode1Ref().selection(DEFAULT, 0.5);

  yield* columnLayoutRef().addItem(codeCard2, 700);

  yield* waitUntil('highlight_first_yield');

  // hightlight yield i; on the first card and gen.next().value; on the second card
  const yieldRange = codeCardCode1Ref().findFirstRange('yield i;');
  const nextRange = codeCard2CodeRef().findFirstRange('gen.next().value;\n// Expected value: 10');
  yield* all( 
    codeCardCode1Ref().selection(yieldRange, 0.5),
    codeCard2CodeRef().selection(nextRange, 0.5)
  );

  yield* waitUntil('highlight_second_yield');

  // highlight yield i + 10; on the first card and gen.next().value; on the second card
  const yieldRange2 = codeCardCode1Ref().findFirstRange('yield i + 10;');
  const nextRange2 = codeCard2CodeRef().findFirstRange('gen.next().value;\n// Expected value: 20');
  yield* all(
    codeCardCode1Ref().selection(yieldRange2, 0.5),
    codeCard2CodeRef().selection(nextRange2, 0.5)
  );

  yield* waitUntil('reset_all_selections');

  // reset to default
  yield* all(
    codeCardCode1Ref().selection(DEFAULT, 0.5),
    codeCard2CodeRef().selection(DEFAULT, 0.5)
  );

  yield* waitUntil('edit_code');
  yield* codeCardCode1Ref().code.edit(0)`function* generator(i) {\n  // some code...\n  yield i;\n  // some more code...\n  yield i + 10;\n}`;
  yield* waitUntil('remove_second_card');

  // reset to default
  yield* codeCardCode1Ref().selection(DEFAULT, 0.5);

  // remove the second card from the column layout
  yield* columnLayoutRef().removeByIndex(1, 0.5);

  yield* waitUntil('scale_first_card');

  // scale up the first card
  yield* codeCard1Ref().scale(1.5, 0.5);

  yield* waitUntil('show_film_tape');

  // reset to default
  yield* codeCard1Ref().opacity(0, 0.5);
  yield* filmTapeRef().opacity(1, 0.5);

  yield* waitUntil('fade_in_code_components');

  // Fade in the 5 Code components one after the other after the film tape appears
  for (let i = 0; i < codeRefs.length; i++) {
    yield* codeRefs[i]().opacity(1, 0.3);
  }

  yield* waitUntil('end');

  // remove the first card from the column layout
});
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Layout, Rect, Txt, Code, Img, Node, signal } from '@motion-canvas/2d';
import { all, Vector2, waitFor, createSignal, SimpleSignal, createRef } from '@motion-canvas/core';
import { CodeCard } from '../components/CodeCard';
import { fadeIn, slideInLeft, slideInRight, zoomIn, fadeOut } from '../animation';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import { SillyEmoji } from '../components/SillyEmoji';

export default makeScene2D(function* (view) {
  view.fill('#1a1a1a');

  // ==================== PART 1: Combined Signal Examples ====================
  
  // Create code card ref for animation
  const signalCodeRef = createRef<Code>();
  
  const signalCard = (
    <CodeCard
      code={`@signal()
public declare readonly opacity: SimpleSignal<number, this>;`}
      width={1280}
      opacity={0}
      codeRef={signalCodeRef}
    />
  );
  view.add(signalCard);

  yield* fadeIn(signalCard, { duration: 0.8 });
  yield* waitFor(1);

  // Animate to show position signal
  yield* signalCodeRef().code(`@signal()
public declare readonly opacity: SimpleSignal<number, this>;

@vector2Signal()
public declare readonly position: Vector2Signal<this>;`, 1);
  yield* waitFor(1);

  // Animate to show scale signal
  yield* signalCodeRef().code(`@signal()
public declare readonly opacity: SimpleSignal<number, this>;

@vector2Signal()
public declare readonly position: Vector2Signal<this>;

@vector2Signal('scale')
public declare readonly scale: Vector2Signal<this>;`, 1);
  yield* waitFor(1.5);

  // Fade out the signals
  yield* fadeOut(signalCard, { duration: 1 });
  yield* waitFor(0.5);

  // ==================== PART 2: Custom Node with Signal ====================
  
  // Create DynamicColumnLayout for custom node demo
  const customNodeLayout = new DynamicColumnLayout({
    width: '100%',
    height: '100%',
    itemGap: 60,
    x: 0,
    y: 0,
    alignItems: 'center',
  });
  view.add(customNodeLayout);

  // Left side - Code showing custom node
  const leftSide = new Rect({
    layout: true,
    direction: 'column',
    width: 800,
    height: 600,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fill: null,
  });

  const codeTitleRef = createRef<Txt>();
  const codeTitle = (
    <Txt
      ref={codeTitleRef}
      text="Custom Node with Signal"
      fontSize={32}
      fontWeight={700}
      fill="#ffffff"
      fontFamily='"Baloo 2", "Baloo", Arial, sans-serif'
    />
  );

  const customNodeCard = (
    <CodeCard
      code={`export class SillyEmoji extends Node {

  @signal()
  public declare readonly silliness;

}`}
      codeProps={{ fontSize: 40 }}
      width={1100}
      height={500}
      alignItems="center"
    />
  );

  leftSide.add([customNodeCard]);

  // Right side - Preview window
  const rightSide = new Rect({
    layout: true,
    direction: 'column',
    width: 600,
    height: 600,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fill: null,
  });

  const previewWindow = (
    <Rect
      width={500}
      height={500}
      fill="#2d2d2f"
      radius={10}
      stroke="#555"
      lineWidth={2}
      layout
      alignItems="center"
      justifyContent="center"
    />
  );

  // Create the SillyEmoji instance
  const emoji = new SillyEmoji({
    silliness: 0,
    scale: 1.5,
  });

  previewWindow.add(emoji);
  rightSide.add([previewWindow]);

  // Add items to DynamicColumnLayout
  yield* customNodeLayout.addItem(leftSide, 1100);
  yield* waitFor(0.3);
  yield* customNodeLayout.addItem(rightSide, 600);
  yield* waitFor(2);

  // ==================== PART 3: Replace with Animation Code ====================
  
  // Create new animation code card with counter reference
  const animationCodeRef = createRef<Code>();
  const animationCodeCard = (
    <CodeCard
      code={`emoji().silliness(100, 1) \n// silliness: 0`}
      codeProps={{ fontSize: 60 }}
      width={1100}
      height={500}
      alignItems="center"
      opacity={0}
      codeRef={animationCodeRef}
    />
  );

  // Replace the custom node card with animation code
  yield* fadeOut(customNodeCard, { duration: 0.5 });
  customNodeCard.remove();
  leftSide.add(animationCodeCard);
  yield* fadeIn(animationCodeCard, { duration: 0.5 });
  
  // Update title
  codeTitleRef().text("Animating the Signal");

  yield* waitFor(0.5);

  // Animate the silliness signal with counter update in code comment
  yield* all(
    emoji.silliness(100, 1),
    (function* () {
      for (let i = 0; i <= 100; i++) {
        animationCodeRef().code(`emoji().silliness(100, 1) \n// silliness: ${i}`);
        yield* waitFor(0.01); // Update every 10ms for smooth counting
      }
    })()
  );
  
  
  yield* waitFor(2);

  // Final fade out
  yield* waitFor(0.5);

  // change silliness to 10000
  emoji.silliness(10000, 1);
  yield* waitFor(1);

  // change silliness to 0
  emoji.silliness(0, 1);
  yield* waitFor(1);

  // change silliness to 10000
  emoji.silliness(10000, 1);


  
});
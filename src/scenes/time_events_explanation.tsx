import { makeScene2D, Rect } from '@motion-canvas/2d';
import { all, waitFor, waitUntil, createRef, easeOutCubic, fadeTransition } from '@motion-canvas/core';
import { MacOSBackground } from '../components/MacOSBackground';
import { CodeCard } from '../components/CodeCard';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import { Video, Code, Img } from '@motion-canvas/2d/lib/components';
import { MEME_STYLE } from '../components/MemeStyle';
import timeEventsDemo from '../images/time_events_demo.mov?url';
import workplaceScreen from '../images/workplace_screen.jpg?url';
import { fadeOut } from '../animation';

export default makeScene2D(function* (view) {
  // Add workplace screen image behind everything (outside camera)
  const workplaceImage = createRef<Img>();
  const workplaceElement = (
    <Img
      ref={workplaceImage}
      src={workplaceScreen}
      width={1920}
      height={1080}
      position={[0, 0]}
      opacity={0}
      zIndex={-1}
    />
  );
  view.add(workplaceElement);

  // Create wrapping rect reference
  const wrapperRect = createRef<Rect>();

  // Setup MacOS background
  const background = createRef<MacOSBackground>();
  
  // Create ref for the Code component
  const codeRef = createRef<Code>();
  
  // Create single CodeCard
  const codeCard = createRef<typeof CodeCard>();
  const codeCardInstance = CodeCard({
    ref: codeCard,
    codeRef: codeRef,
    code: 'waitFor(2);',
    width: 1100,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 60,
  });

  // Slide in code card from bottom
  codeCardInstance.position([0, 600]);
  codeCardInstance.opacity(0);

  // Create video with MemeStyle
  const video = createRef<Video>();
  const videoElement = (
    <Video
      ref={video}
      src={timeEventsDemo}
      width={800}
      height={450}
      position={[0, 600]}
      opacity={0}
      scale={2}
      loop
      {...MEME_STYLE}
      radius={5}
    />
  );

  // Add wrapping rect with all elements inside it
  view.add(
    <Rect ref={wrapperRect} width="100%" height="100%">
      <MacOSBackground
        ref={background}
        showMenuBar={false}
        showDock={false}
      />
      {codeCardInstance}
      {videoElement}
    </Rect>
  );


  yield* fadeTransition(1);
  
  yield* all(
    codeCardInstance.position([0, 0], 0.8, easeOutCubic),
    codeCardInstance.opacity(1, 0.8, easeOutCubic),
  );

  // Wait for 2 seconds
  yield* waitUntil('change_to_waituntil');

  // Animate the code change from waitFor(2) to waitUntil('event')
  yield* codeRef().code.replace(
    codeRef().findFirstRange('waitFor(2)'),
    "waitUntil('event')",
    0.6
  );

  // Wait a bit
  yield* waitUntil('remove_code_card');

  // fade out the code card
  yield* fadeOut(codeCardInstance, {duration: 0.5});

  // Remove code card
  codeCardInstance.remove();

  // Slide in video from bottom
  yield* all(
    videoElement.position([0, 0], 0.8, easeOutCubic),
    videoElement.opacity(1, 0.8, easeOutCubic),
  );

  // Video is already set to play automatically

  // Wait a bit for video to play
  yield* waitUntil('zoom_to_bottom');

  // Zoom in to bottom area
  yield* all(
    videoElement.scale(3.5, 1),
    videoElement.position([-300, 50], 1),
  );


  // play video
  video().play();
  yield* waitUntil('wait_for_video');

  // Wait for zoom effect
  yield* waitUntil('zoom_out');

  // Zoom out to default
  yield* all(
    videoElement.scale(2, 1.2, easeOutCubic),
    videoElement.position([0, 0], 1.2, easeOutCubic),
  );

  // Wait for final state
  yield* waitUntil('add_zoom_code_card');

  // Create new CodeCard with zoomIn animation content
  const zoomCodeRef = createRef<Code>();
  const zoomCodeCard = createRef<typeof CodeCard>();
  const zoomCodeCardInstance = CodeCard({
    ref: zoomCodeCard,
    codeRef: zoomCodeRef,
    code: 'yield * circle().scale(2, useDuration(\'event\'));',
    width: 1100,
    height: 220,
    alignItems: 'center',
    scale: 0.9,
    justifyContent: 'center',
  });


  // Wait a bit
  yield* waitUntil('fade_in_workplace');


  // Fade in workplace image
  yield* workplaceElement.opacity(1, 1, easeOutCubic);


  yield* all(
    wrapperRect().scale(0.56, 1, easeOutCubic),
    wrapperRect().position([-6, -52], 1, easeOutCubic),
  );

  // Wait for final state
  yield* waitUntil('slide_in_zoom_code');

    // Position the new code card off-screen initially
    zoomCodeCardInstance.position([0, 600]);
    zoomCodeCardInstance.opacity(0);
  
    // Add the new code card to the wrapper
    view.add(zoomCodeCardInstance);

    // Slide in the new code card
    yield* all(
      zoomCodeCardInstance.position([0, -50], 0.8, easeOutCubic),
      zoomCodeCardInstance.opacity(1, 0.8, easeOutCubic),
    );

    // blur rect behind code card
    wrapperRect().filters.blur(5);
    wrapperRect().filters.grayscale(1);

      // Highlight the useDuration('event') part
  yield* zoomCodeCardInstance.highlight("useDuration('event')", 0.5);

  // Wait for highlight
  yield* waitUntil('reset_highlight');

  // Reset highlight
  yield* zoomCodeCardInstance.resetHighlight(0.5);

  // Wait a bit more
  yield* waitUntil('remove_blur');

  // remove blur and grayscale and remove code card
  yield* all(
    wrapperRect().filters.blur(0, 1),
    wrapperRect().filters.grayscale(0, 1),
    fadeOut(zoomCodeCardInstance, {duration: 1}),
  );

  // Wait a bit more
  yield* waitUntil('zoom_back');

  // zoom back to the default
  yield* all(
    wrapperRect().scale(1, 1, easeOutCubic),
    wrapperRect().position([0, 0], 1, easeOutCubic),
  );

  // Wait a bit more
  yield* waitUntil('end');
}); 
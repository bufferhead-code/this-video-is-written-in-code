import { makeScene2D, Circle, Txt, Rect, Img, Layout } from '@motion-canvas/2d';
import { all, createSignal, easeInOutCubic, easeOutCubic, fadeTransition, waitFor, waitUntil } from '@motion-canvas/core';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { MacOSBackground } from '../components/MacOSBackground';
import { Browser } from '../components/Browser';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import { Logo } from '../components/Logo';
import { slideInBottom } from '../animation';
import githubScreenshot from '../images/github_motion_canvas_example.jpeg?url';
import discordLogo from '../images/discord-logo.svg?url';
import solidtimeScreenshot from '../images/solidtime_screenshot.jpeg?url';

export default makeScene2D(function* (view) {
  // Create signals for animation control
  const browserY = createSignal(1080); // Start below screen
  const discordOpacity = createSignal(0);
  const discordScale = createSignal(0.5);
  const layoutOpacity = createSignal(1);

  // Create MacOS background
  const macBackground = new MacOSBackground({
  });
  view.add(macBackground);

  // Create dynamic column layout for browser and discord
  const columnLayout = new DynamicColumnLayout({
    itemGap: 40,
    animationDuration: 0.8,
    position: [0, 0],
    alignItems: 'center',
    opacity: () => layoutOpacity(),
  });

  // Create browser with GitHub screenshot
  const browser = new Browser({
    width: 1200,
    screenshotSrc: githubScreenshot,
    url: 'https://github.com/motion-canvas/examples',
    screenshotDelay: 0.3,
  });


  // Create second browser with Solidtime screenshot in dark mode
  const solidtimeBrowser = new Browser({
    width: 1800,
    screenshotSrc: solidtimeScreenshot,
    url: 'https://solidtime.io',
    screenshotDelay: 0.3,
    darkMode: true,
    opacity: 0,
    position: [0, -80],
  });

  // Create Discord logo using Logo component wrapped in a Rect
  const discordLogoComponent = new Logo({
    src: discordLogo,
    containerSize: 150,
    logoWidth: 100,
    logoHeight: 78,
  });

  // Wrap the logo in a Rect container for DynamicColumnLayout compatibility
  const discordContainer = new Rect({
    width: 150,
    height: 150,
    fill: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  });
  discordContainer.add(discordLogoComponent);

  // Add browser to column layout
  columnLayout.add(browser);

  // Add column layout to view
  view.add(columnLayout);

  // Add solidtime browser to view (initially hidden)
  view.add(solidtimeBrowser);

  // Set initial position of browser below screen
  browser.position([0, 1080]);

  // Fade transition
  yield* fadeTransition(1);

  // Wait a moment
  yield* waitFor(0.5);

  // Slide browser in from bottom using animation preset
  yield* slideInBottom(browser, { duration: 1, distance: 1080 });

  // Wait for browser to settle
  yield* waitFor(1);

  // Wait for browser to be ready before adding Discord logo
  yield* waitFor(0.1);

  // Add Discord logo to the right side
  yield* columnLayout.addItem(discordContainer, 150);

  // Animate Discord logo appearance
  yield* all(
    discordOpacity(1, 0.6, easeOutCubic),
    discordScale(1, 0.6, easeOutCubic),
  );

  // Hold the scene
  yield* waitFor(2);

  // Wait for the time event to fade out layout and show solidtime browser
  yield* waitUntil('show_solidtime');

  // Fade out the dynamic layout
  yield* layoutOpacity(0, 0.8, easeOutCubic);

  // Wait a moment
  yield* waitFor(0.3);

  // Wait for solidtime browser to be ready
  yield* waitFor(0.1);

  // Slide in the solidtime browser from bottom using animation preset
  yield* slideInBottom(solidtimeBrowser, { duration: 1, distance: 1080 });

  // Hold the final scene
  yield* waitFor(2);
}); 
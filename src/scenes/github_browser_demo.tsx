import { makeScene2D, Circle, Txt, Rect, Img, Layout } from '@motion-canvas/2d';
import { all, createSignal, easeInOutCubic, easeOutCubic, fadeTransition, waitFor, waitUntil } from '@motion-canvas/core';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { MacOSBackground } from '../components/MacOSBackground';
import { Browser } from '../components/Browser';
import { Logo } from '../components/Logo';
import { StyledText } from '../components/StyledText';
import { YoutubeChannelCard } from '../components/YouTubeChannelCard';
import { slideInBottom } from '../animation';
import githubScreenshot from '../images/github_motion_canvas_example.jpeg?url';
import discordLogo from '../images/discord-logo.svg?url';
import solidtimeScreenshot from '../images/solidtime_screenshot.jpeg?url';
import bufferheadAvatar from '../images/bufferhead_avatar.svg?url';

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

  // Create regular layout for browser and discord
  const columnLayout = new Layout({
    gap: 150,
    position: [0, 0],
    alignItems: 'center',
    opacity: () => layoutOpacity(),
    layout: true,
  });

  // Create browser with GitHub screenshot
  const browser = new Browser({
    width: 1200,
    screenshotSrc: githubScreenshot,
    url: 'https://github.com/motion-canvas/examples',
    screenshotDelay: 0.3,
    opacity: 0,
    position: [0, -50],

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
    containerSize: 450,
    logoWidth: 300,
    logoHeight: 78,
  });

  // Wrap the logo in a Rect container for layout compatibility
  const discordContainer = new Rect({
    width: 350,
    height: 350,
    fill: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  });
  discordContainer.add(discordLogoComponent);

  // Create StyledText component for "Community"
  const communityText = new StyledText({
    text: '',
    size: 'xl',
    colorType: 'secondary',
    textAlign: 'center',
    position: [0, 0],
    opacity: 0,
  });

  // Add browser to layout
  columnLayout.add(browser);
  columnLayout.add(discordContainer);

  // Add column layout to view
  view.add(columnLayout);

  // Add community text to view
  view.add(communityText);

  // Add solidtime browser to view (initially hidden)
  view.add(solidtimeBrowser);

  // Create YouTubeChannelCard for Bufferhead
  const bufferheadCard = new YoutubeChannelCard({
    channelName: 'Bufferhead',
    username: '@bufferhead_',
    subscribers: '7.64K subscribers',
    videos: '28 videos',
    description: 'expert in breaking ci pipelines. i do silly web projects sometimes.',
    cardWidth: 1300,
    cardHeight: 420,
    avatarSrc: bufferheadAvatar,
    opacity: 0,
    scale: 0,
  });
  view.add(bufferheadCard);

  // Fade transition
  yield* fadeTransition(1);


  // Show community text with typewriter effect at the start
  yield* waitUntil('community_text');
  yield* communityText.opacity(1, 0.3, easeOutCubic);
  yield* communityText.typewrite('Community', 1, 0);

  // Wait a moment after community text
  yield* waitFor(0.5);

  // Slide browser in from bottom using animation preset
  yield* waitUntil('browser_slide_in');
  yield* all(
    slideInBottom(browser, { duration: 1, distance: 1080 }),
    communityText.opacity(0, 0.8, easeOutCubic),
  );

  // Wait for browser to settle
  yield* waitFor(1);

  // Wait for browser to be ready before adding Discord logo
  yield* waitFor(0.1);

    // Animate Discord logo appearance
  yield* waitUntil('discord_fade_in');
  yield* all(
    discordOpacity(1, 0.6, easeOutCubic),
    discordScale(1, 0.6, easeOutCubic),
    discordContainer.opacity(1, 0.6, easeOutCubic),
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

  // Hold the solidtime browser scene
  yield* waitFor(2);

  // Fade out solidtime browser before showing Bufferhead card
  yield* waitUntil('fade_out_solidtime');
  yield* solidtimeBrowser.opacity(0, 0.8, easeOutCubic);

  // Wait a moment after fade out
  yield* waitFor(0.3);

  // Show Bufferhead YouTube card with ZoomIn effect
  yield* waitUntil('bufferhead_card');
  yield* all(
    bufferheadCard.opacity(1, 0.8, easeOutCubic),
    bufferheadCard.scale(1, 0.8, easeOutCubic),
  );

  // Hold the Bufferhead card scene
  yield* waitFor(2);

  // Fade out the Bufferhead YouTube card
  yield* waitUntil('fade_out_bufferhead');
  yield* all(
    bufferheadCard.opacity(0, 0.8, easeOutCubic),
    bufferheadCard.scale(0.8, 0.8, easeOutCubic),
  );

  // Hold the final scene
  yield* waitFor(1);

  yield* waitUntil('scene_end');

}); 
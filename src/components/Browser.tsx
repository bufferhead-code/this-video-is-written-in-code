import { Img, Rect, Node, NodeProps, Txt, Layout } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { all, waitFor } from '@motion-canvas/core';
import { MacWindow } from './MacWindow';

export interface BrowserProps extends NodeProps {
  url?: SignalValue<string>;
  width?: SignalValue<number>;
  height?: SignalValue<number>;
  scale?: SignalValue<number>;
  screenshotSrc?: SignalValue<string>;
  screenshotDelay?: SignalValue<number>;
  darkMode?: SignalValue<boolean>;
}

export class Browser extends Node {
  @initial('https://www.google.com')
  @signal()
  declare public readonly url: SimpleSignal<string>;

  @initial(1200)
  @signal()
  declare public readonly width: SimpleSignal<number>;

  @initial(800)
  @signal()
  declare public readonly height: SimpleSignal<number>;

  @initial(1)
  @signal()
  declare public readonly browserScale: SimpleSignal<number>;

  @initial('')
  @signal()
  declare public readonly src: SimpleSignal<string>;

  @initial(0.5)
  @signal()
  declare public readonly screenshotDelay: SimpleSignal<number>;

  @initial(false)
  @signal()
  declare public readonly darkMode: SimpleSignal<boolean>;

  private macWindow: MacWindow;
  private contentArea: Rect;
  private screenshotImg: Img;
  private urlText: Txt;

  public constructor(props?: BrowserProps) {
    super(props);

    // Map screenshotSrc to src if provided
    if (props?.screenshotSrc) {
      this.src(props.screenshotSrc);
    }

    this.setupBrowserUI();

    // If screenshot is provided, resize to match image after UI is set up
    if (props?.screenshotSrc) {
      this.resizeToImage();
    }
  }

  private setupBrowserUI() {
    const windowWidth = this.width();
    const windowHeight = this.height();
    const navBarHeight = 50; // Navigation bar height
    const titleBarHeight = 100; // Increased title bar height
    const contentHeight = windowHeight - titleBarHeight - navBarHeight;

    // Create Mac window (Safari style)
    this.macWindow = new MacWindow({
      width: windowWidth,
      height: windowHeight,
      showTitle: false, // Safari doesn't show title in title bar
      lightMode: !this.darkMode(), // Safari uses light/dark mode styling
      scale: this.browserScale(),
      titleBarHeight: titleBarHeight,
    });
    this.add(this.macWindow);

    // Add URL bar to title bar slot
    const titleBarSlot = this.macWindow.getTitleBarSlot();

    // Navigation buttons container
    const navButtons = new Layout({
      layout: true,
      direction: 'row',
      gap: 10,
      alignItems: 'center',
    });

    // Back button
    const backBtn = new Txt({
      text: '‹',
      fontSize: 24,
      fill: this.darkMode() ? '#9aa0a6' : '#5f6368',
    });
    navButtons.add(backBtn);

    // Forward button
    const forwardBtn = new Txt({
      text: '›',
      fontSize: 24,
      fill: this.darkMode() ? '#9aa0a6' : '#5f6368',
    });
    navButtons.add(forwardBtn);

    titleBarSlot.add(navButtons);

    // URL bar in title bar
    const urlBar = new Layout({
      layout: true,
      direction: 'row',
      justifyContent: 'center',
      grow: 1,
      gap: 10,
      alignItems: 'center',
    });

    // URL bar rectangle with text overlay
    const urlBarRect = new Rect({
      margin: 10,
      width: windowWidth / 2,
      height: 38,
      fill: this.darkMode() ? '#1E1E1E' : '#f1f3f4',
      radius: 10,
      stroke: this.darkMode() ? '#424244' : '#dadce0',
      lineWidth: 1,
      alignItems: 'center',
      paddingLeft: 20,
    });

    // URL text as overlay on the rectangle
    this.urlText = new Txt({
      text: this.url(),
      fontSize: 18,
      fontWeight: 400,
      fill: this.darkMode() ? '#e0e0e0' : '#5c6063',
      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
      textAlign: 'center',
      width: '100%',
    });
    urlBarRect.add(this.urlText);
    urlBar.add(urlBarRect);
    titleBarSlot.add(urlBar);

    // Content area filling the remaining space
    this.contentArea = new Rect({
      layout: true,
      width: windowWidth,
      fill: this.darkMode() ? '#1c1c1e' : '#ffffff',
      clip: true,
    });

    // Screenshot image in content area
    this.screenshotImg = new Img({
      src: this.src(),
      width: windowWidth,
      position: [0, 0],
    });
    this.contentArea.add(this.screenshotImg);

    // Add navigation bar and content area to Mac window
    const windowContent = new Layout({
      layout: true,
      direction: 'column',
      width: '100%',
      height: '100%',
    });
    windowContent.add(this.contentArea);
    this.macWindow.getContentArea().add(windowContent);
  }

  public *navigateToUrl(newUrl: string, screenshotSrc?: string) {
    // Update URL display
    yield* this.urlText.text(newUrl, 0.3);
    this.url(newUrl);

    // Update screenshot if provided
    if (screenshotSrc) {
      yield* this.loadScreenshot(screenshotSrc);
    }
  }

  private *resizeToImage() {
    // Wait for the image to load before accessing naturalSize
    yield this.screenshotImg;

    // Get the natural size of the current image
    const naturalSize = this.screenshotImg.naturalSize();
    if (naturalSize.width > 0 && naturalSize.height > 0) {
      // Respect the browser's width setting and calculate height based on image aspect ratio
      const navBarHeight = 50; // Updated to match new navbar height
      const titleBarHeight = 100; // Updated to match new title bar height
      const browserWidth = this.width();

      // Calculate the height based on the image's aspect ratio
      const imageAspectRatio = naturalSize.height / naturalSize.width;
      const contentHeight = browserWidth * imageAspectRatio;
      const newHeight = contentHeight + navBarHeight + titleBarHeight;

      // Update only the browser height (width stays as set)
      this.height(newHeight);

      // Recreate the UI with new dimensions
      this.removeChildren();
      this.setupBrowserUI();
    }
  }

  public *loadScreenshot(screenshotSrc: string) {
    // Add loading animation
    yield* this.screenshotImg.opacity(0.3, 0.2);

    // Wait for delay if specified
    if (this.screenshotDelay() > 0) {
      yield* waitFor(this.screenshotDelay());
    }

    // Update screenshot source
    this.src(screenshotSrc);
    this.screenshotImg.src(screenshotSrc);

    // Wait for image to load and resize to match image dimensions
    yield* this.resizeToImage();

    // Fade in the result
    yield* this.screenshotImg.opacity(1, 0.3);
  }

  public *reload(screenshotSrc?: string) {
    if (screenshotSrc) {
      yield* this.loadScreenshot(screenshotSrc);
    } else {
      // Just do a reload animation
      yield* all(
        this.screenshotImg.opacity(0.3, 0.2),
        waitFor(this.screenshotDelay()),
      );
      yield* this.screenshotImg.opacity(1, 0.3);
    }
  }

  public *animateResize(
    newWidth: number,
    newHeight: number,
    duration: number = 1,
  ) {
    yield* all(
      this.width(newWidth, duration),
      this.height(newHeight, duration),
    );

    // Recreate the UI with new dimensions
    this.removeChildren();
    this.setupBrowserUI();
  }

  public *animateTrafficLightHover(
    button: 'red' | 'yellow' | 'green',
    show: boolean = true,
  ) {
    yield* this.macWindow.animateTrafficLightHover(button, show);
  }

  public *animateClose() {
    yield* this.macWindow.animateClose();
  }

  public *animateMinimize() {
    yield* this.macWindow.animateMinimize();
  }

  public *animateMaximize() {
    // Animate window maximizing
    const newWidth = this.width() * 1.2;
    const newHeight = this.height() * 1.2;

    yield* all(this.width(newWidth, 0.4), this.height(newHeight, 0.4));

    // Recreate UI with new dimensions
    this.removeChildren();
    this.setupBrowserUI();
  }
}

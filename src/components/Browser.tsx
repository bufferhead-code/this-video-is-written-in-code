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
    const navBarHeight = 80; // Increased navbar height
    const titleBarHeight = 80; // Increased title bar height to match navbar
    const contentHeight = windowHeight - titleBarHeight - navBarHeight;

    // Create Mac window (Safari style)
    this.macWindow = new MacWindow({
      width: windowWidth,
      height: windowHeight,
      showTitle: false, // Safari doesn't show title in title bar
      lightMode: true, // Safari uses light mode styling
      scale: this.browserScale(),
      titleBarHeight: titleBarHeight,
    });
    this.add(this.macWindow);

    // Add URL bar to title bar slot
    const titleBarSlot = this.macWindow.getTitleBarSlot();

    // Reload button
    const reloadBtn = new Txt({
      text: '↻',
      fontSize: 20,
      fill: '#5f6368',
      marginRight: 15,
    });
    titleBarSlot.add(reloadBtn);

    // URL bar in title bar
    const urlBar = new Rect({
      layout: true,
      width: windowWidth - 120,
      height: 36,
      fill: '#f1f3f4',
      radius: 18,
      stroke: '#dadce0',
      lineWidth: 1,
      alignItems: 'center',
      paddingLeft: 20,
    });
    titleBarSlot.add(urlBar);

    // URL text in URL bar
    this.urlText = new Txt({
      text: this.url(),
      fontSize: 14,
      fill: '#3c4043',
      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
    });
    urlBar.add(this.urlText);

    // Content area filling the remaining space
    this.contentArea = new Rect({
      layout: true,
      width: windowWidth,
      fill: '#ffffff',
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
      const navBarHeight = 80; // Updated to match new navbar height
      const titleBarHeight = 80; // Updated to match new title bar height
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

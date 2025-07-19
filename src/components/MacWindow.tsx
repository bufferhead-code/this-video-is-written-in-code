import {
  Rect,
  Txt,
  Layout,
  RectProps,
  Circle,
  Node,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { all } from '@motion-canvas/core';

export interface MacWindowProps extends RectProps {
  title?: SignalValue<string>;
  lightMode?: SignalValue<boolean>;
  showTitle?: SignalValue<boolean>;
  titleBarHeight?: SignalValue<number>;
  children?: Node[];
}

export class MacWindow extends Rect {
  @initial('')
  @signal()
  declare public readonly title: SimpleSignal<string>;

  @initial(false)
  @signal()
  declare public readonly lightMode: SimpleSignal<boolean>;

  @initial(true)
  @signal()
  declare public readonly showTitle: SimpleSignal<boolean>;

  @initial(36)
  @signal()
  declare public readonly titleBarHeight: SimpleSignal<number>;

  private titleBar: Rect;
  private titleText: Txt;
  private redButton: Circle;
  private yellowButton: Circle;
  private greenButton: Circle;
  private redButtonIcon: Circle;
  private yellowButtonIcon: Circle;
  private greenButtonIcon: Circle;
  private contentArea: Rect;
  private titleBarSlot: Layout;

  public constructor(props?: MacWindowProps) {
    const { children, ...rectProps } = props || {};

    super({
      layout: true,
      direction: 'column',
      radius: 10,
      shadowBlur: 30,
      shadowColor: 'rgba(0, 0, 0, 0.35)',
      shadowOffset: [0, 25],
      ...rectProps,
    });

    this.setupWindow();

    if (children) {
      children.forEach((child) => this.contentArea.add(child));
    }
  }

  private setupWindow() {
    // Title bar
    this.titleBar = new Rect({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      width: '100%',
      height: this.titleBarHeight,
      fill: () => this.getColors().titleBar,
      radius: [10, 10, 0, 0],
      paddingLeft: 17,
      paddingRight: 17,
      shadowBlur: 0.5,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: [0, 0.5],
    });
    this.add(this.titleBar);

    // Traffic light buttons
    const trafficLights = new Layout({
      layout: true,
      direction: 'row',
      gap: 8,
      alignItems: 'center',
    });
    this.titleBar.add(trafficLights);

    this.redButton = new Circle({
      size: 14,
      fill: '#FF5E57',
      stroke: 'rgba(0, 0, 0, 0.12)',
      lineWidth: 0.5,
    });
    this.redButtonIcon = new Circle({
      size: 4,
      fill: '#bf4642',
      opacity: 0,
    });
    this.redButton.add(this.redButtonIcon);
    trafficLights.add(this.redButton);

    this.yellowButton = new Circle({
      size: 14,
      fill: '#FFBB2E',
      stroke: 'rgba(0, 0, 0, 0.12)',
      lineWidth: 0.5,
    });
    this.yellowButtonIcon = new Circle({
      size: 4,
      fill: '#bf9123',
      opacity: 0,
    });
    this.yellowButton.add(this.yellowButtonIcon);
    trafficLights.add(this.yellowButton);

    this.greenButton = new Circle({
      size: 14,
      fill: () => (this.lightMode() ? '#28CA42' : '#4B4C4E'),
      stroke: 'rgba(0, 0, 0, 0.12)',
      lineWidth: 0.5,
    });
    this.greenButtonIcon = new Circle({
      size: 4,
      fill: () => (this.lightMode() ? '#1f9932' : '#2a2b2d'),
      opacity: 0,
    });
    this.greenButton.add(this.greenButtonIcon);
    trafficLights.add(this.greenButton);

    // Title bar slot for custom content
    this.titleBarSlot = new Layout({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      grow: 1,
      paddingLeft: 20,
      paddingRight: 20,
    });
    this.titleBar.add(this.titleBarSlot);

    // Title text (conditionally shown)
    if (this.showTitle()) {
      this.titleText = new Txt({
        fill: () => this.getColors().titleText,
        fontFamily:
          'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 20,
        fontWeight: 400,
        text: this.title,
      });
      this.titleBarSlot.add(this.titleText);
    }

    // Content area
    this.contentArea = new Rect({
      layout: true,
      direction: 'column',
      grow: 1,
      fill: () => this.getColors().windowBackground,
      radius: [0, 0, 10, 10],
      clip: true,
    });
    this.add(this.contentArea);

    // Set up main window colors using signal functions
    this.fill(() => this.getColors().windowBackground);
    this.stroke(() => this.getColors().stroke);
  }

  private getColors() {
    const lightMode = this.lightMode();
    return {
      windowBackground: lightMode ? '#F6F6F6' : '#282828',
      titleBar: lightMode ? '#E5E5E5' : '#2d2d2f',
      titleText: lightMode
        ? 'rgba(28, 28, 30, 0.6)'
        : 'rgba(235, 235, 245, 0.6)',
      stroke: lightMode ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    };
  }

  public getContentArea(): Rect {
    return this.contentArea;
  }

  public getTitleBar(): Rect {
    return this.titleBar;
  }

  public getTitleBarSlot(): Layout {
    return this.titleBarSlot;
  }

  public *animateTrafficLightHover(
    button: 'red' | 'yellow' | 'green',
    show: boolean = true,
  ) {
    const targetButton =
      button === 'red'
        ? this.redButton
        : button === 'yellow'
          ? this.yellowButton
          : this.greenButton;

    const targetIcon =
      button === 'red'
        ? this.redButtonIcon
        : button === 'yellow'
          ? this.yellowButtonIcon
          : this.greenButtonIcon;

    const iconOpacity = show ? 1 : 0;
    const buttonScale = show ? 1.1 : 1;

    yield* all(
      targetButton.scale(buttonScale, 0.1),
      targetIcon.opacity(iconOpacity, 0.1),
    );
  }

  public *animateClose() {
    yield* all(this.scale(0.8, 0.3), this.opacity(0, 0.3));
  }

  public *animateMinimize() {
    yield* all(this.scale([0.1, 0.01], 0.4), this.opacity(0, 0.4));
  }
}

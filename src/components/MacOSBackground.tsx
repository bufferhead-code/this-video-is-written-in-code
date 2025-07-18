import { Rect, Txt, Circle, Layout, Node, NodeProps, Line, Img } from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import { tween, all } from '@motion-canvas/core';
import macBackgroundImg from './media/mac_background.png';
import macDockImg from './media/mac_dock.png';
import macMenuBarImg from './media/mac_menubar.svg';

export interface MacOSBackgroundProps extends NodeProps {
  showMenuBar?: SignalValue<boolean>;
  showDock?: SignalValue<boolean>;
  wallpaperColor?: SignalValue<PossibleColor>;
}

export class MacOSBackground extends Node {
  @initial(false)
  @signal()
  public declare readonly showMenuBar: SimpleSignal<boolean>;

  @initial(false)
  @signal()
  public declare readonly showDock: SimpleSignal<boolean>;

  @initial('#2C63D2')
  @signal()
  public declare readonly wallpaperColor: SimpleSignal<PossibleColor>;

  // Add separate opacity signal for smooth dock animation
  @initial(0)
  @signal()
  public declare readonly dockOpacity: SimpleSignal<number>;

  // Add separate opacity signal for smooth menu bar animation
  @initial(0)
  @signal()
  public declare readonly menuBarOpacity: SimpleSignal<number>;

  private dock: Img;
  private menuBarBackground: Img;

  public constructor(props?: MacOSBackgroundProps) {
    super(props);
    this.setupBackground();
    
    // Initialize opacity based on initial showDock and showMenuBar values
    this.dockOpacity(this.showDock() ? 1 : 0);
    this.menuBarOpacity(this.showMenuBar() ? 1 : 0);
  }

  private setupBackground() {
    // Main desktop background with macOS Big Sur wallpaper
    const background = new Img({
      src: macBackgroundImg,
      width: 1920,
      height: 1080,
    });
    this.add(background);

    // Menu Bar Background - exact match to Figma design
    this.menuBarBackground = new Img({
      width: 1920,
      src: macMenuBarImg,
      position: [0, -540 + 12], // Positioned at the very top of the screen
      opacity: () => this.menuBarOpacity(),
    });
    this.add(this.menuBarBackground);

    // Dock (keeping the existing dock design)
    this.dock = new Img({
      width: 320,
      src: macDockImg,
      position: [0, 480],
      opacity: () => this.dockOpacity(),
    });
    this.add(this.dock);
  }

  // Animation method for dock visibility
  public *animateDock(show: boolean, duration: number = 0.5) {
    const targetOpacity = show ? 1 : 0;
    yield* this.dockOpacity(targetOpacity, duration);
    // Update the boolean signal to match the final state
    this.showDock(show);
  }

  // Animation method for menu bar visibility
  public *animateMenuBar(show: boolean, duration: number = 0.5) {
    const targetOpacity = show ? 1 : 0;
    const startY = show ? -540 - 24 : -540 + 12; // Start above screen when showing
    const endY = show ? -540 + 12 : -540 - 24; // End above screen when hiding
    
    // Set initial position when showing
    if (show) {
      this.menuBarBackground.position([0, startY]);
    }
    
    // Animate position and opacity simultaneously
    yield* all(
      this.menuBarBackground.position([0, endY], duration),
      this.menuBarOpacity(targetOpacity, duration)
    );
    
    // Update the boolean signal to match the final state
    this.showMenuBar(show);
  }
}

export const MacOSDesktop = (props: MacOSBackgroundProps) => {
  return <MacOSBackground {...props} />;
}; 
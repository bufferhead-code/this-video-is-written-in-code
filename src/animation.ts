import { Node } from '@motion-canvas/2d';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { waitFor, all } from '@motion-canvas/core';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';
import {
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  linear,
  easeInOutElastic,
  easeOutElastic,
  easeInElastic,
} from '@motion-canvas/core/lib/tweening';
import { TimingFunction } from '@motion-canvas/core/lib/tweening';

import { playWhoosh, playZoomIn } from './soundeffects';


export interface AnimationConfig {
  duration?: number;
  delay?: number;
  distance?: number;
  overshoot?: boolean;
  easing?: TimingFunction;
}

export interface ZoomConfig extends Omit<AnimationConfig, 'distance'> {
  fromScale?: number;
  toScale?: number;
}

/**
 * Animation Presets for Motion Canvas
 * Provides slide, fade, and zoom animations with spring/overshoot options
 */
export class AnimationPresets {
  // Default configurations
  private static readonly DEFAULT_DURATION = 0.5;
  private static readonly DEFAULT_DISTANCE = 200;
  private static readonly DEFAULT_DELAY = 0;

  /**
   * SLIDE IN ANIMATIONS
   */

  // Slide in from bottom with fade in
  public static *slideInFromBottom(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeOutBack : easeOutQuart,
    } = config;

    const startPosition = node.position();

    // Set initial state
    node.position([startPosition.x, startPosition.y + distance]);
    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Play whoosh sound
    playWhoosh({ duration });

    // Animate to final position
    yield* all(
      node.position(startPosition, duration, easing),
      node.opacity(1, duration * 0.8, easeOutCubic),
    );
  }

  // Slide in from top with fade in
  public static *slideInFromTop(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeOutBack : easeOutQuart,
    } = config;

    const startPosition = node.position();

    // Set initial state
    node.position([startPosition.x, startPosition.y - distance]);
    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(startPosition, duration, easing);
    yield* node.opacity(1, duration * 0.8, easeOutCubic);
  }

  // Slide in from left with fade in
  public static *slideInFromLeft(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeOutBack : easeOutQuart,
    } = config;

    const startPosition = node.position();

    // Set initial state
    node.position([startPosition.x - distance, startPosition.y]);
    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(startPosition, duration, easing);
    yield* node.opacity(1, duration * 0.8, easeOutCubic);
  }

  // Slide in from right with fade in
  public static *slideInFromRight(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeOutBack : easeOutQuart,
    } = config;

    const startPosition = node.position();

    // Set initial state
    node.position([startPosition.x + distance, startPosition.y]);
    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(startPosition, duration, easing);
    yield* node.opacity(1, duration * 0.8, easeOutCubic);
  }

  /**
   * SLIDE OUT ANIMATIONS
   */

  // Slide out to bottom with fade out
  public static *slideOutToBottom(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeInBack : easeInQuart,
    } = config;

    const startPosition = node.position();
    const endPosition = new Vector2(
      startPosition.x,
      startPosition.y + distance,
    );

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(endPosition, duration, easing);
    yield* node.opacity(0, duration * 0.8, easeInCubic);
  }

  // Slide out to top with fade out
  public static *slideOutToTop(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeInBack : easeInQuart,
    } = config;

    const startPosition = node.position();
    const endPosition = new Vector2(
      startPosition.x,
      startPosition.y - distance,
    );

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(endPosition, duration, easing);
    yield* node.opacity(0, duration * 0.8, easeInCubic);
  }

  // Slide out to left with fade out
  public static *slideOutToLeft(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeInBack : easeInQuart,
    } = config;

    const startPosition = node.position();
    const endPosition = new Vector2(
      startPosition.x - distance,
      startPosition.y,
    );

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(endPosition, duration, easing);
    yield* node.opacity(0, duration * 0.8, easeInCubic);
  }

  // Slide out to right with fade out
  public static *slideOutToRight(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
      overshoot = false,
      easing = overshoot ? easeInBack : easeInQuart,
    } = config;

    const startPosition = node.position();
    const endPosition = new Vector2(
      startPosition.x + distance,
      startPosition.y,
    );

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final position
    yield* node.position(endPosition, duration, easing);
    yield* node.opacity(0, duration * 0.8, easeInCubic);
  }

  /**
   * OVERSHOOT VARIANTS (Enhanced spring animations)
   */

  // Overshoot slide in from bottom with elastic bounce
  public static *overshootSlideInFromBottom(
    node: Node,
    config: AnimationConfig = {},
  ) {
    const {
      duration = this.DEFAULT_DURATION * 1.2,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
    } = config;

    return yield* this.slideInFromBottom(node, {
      ...config,
      duration,
      easing: easeOutElastic,
      overshoot: true,
    });
  }

  // Overshoot slide in from top with elastic bounce
  public static *overshootSlideInFromTop(
    node: Node,
    config: AnimationConfig = {},
  ) {
    const {
      duration = this.DEFAULT_DURATION * 1.2,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
    } = config;

    return yield* this.slideInFromTop(node, {
      ...config,
      duration,
      easing: easeOutElastic,
      overshoot: true,
    });
  }

  // Overshoot slide in from left with elastic bounce
  public static *overshootSlideInFromLeft(
    node: Node,
    config: AnimationConfig = {},
  ) {
    const {
      duration = this.DEFAULT_DURATION * 1.2,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
    } = config;

    return yield* this.slideInFromLeft(node, {
      ...config,
      duration,
      easing: easeOutElastic,
      overshoot: true,
    });
  }

  // Overshoot slide in from right with elastic bounce
  public static *overshootSlideInFromRight(
    node: Node,
    config: AnimationConfig = {},
  ) {
    const {
      duration = this.DEFAULT_DURATION * 1.2,
      delay = this.DEFAULT_DELAY,
      distance = this.DEFAULT_DISTANCE,
    } = config;

    return yield* this.slideInFromRight(node, {
      ...config,
      duration,
      easing: easeOutElastic,
      overshoot: true,
    });
  }

  /**
   * ZOOM ANIMATIONS
   */

  // Zoom in from center with fade in
  public static *zoomInFromCenter(node: Node, config: ZoomConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      fromScale = 0,
      toScale = 1,
      overshoot = false,
      easing = overshoot ? easeOutBack : easeOutCubic,
    } = config;

    // Set initial state
    node.scale(fromScale);
    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Play zoom in sound
    playWhoosh({ duration });

    // Animate to final state
    yield* all(
      node.scale(toScale, duration, easing),
      node.opacity(1, duration * 0.8, easeOutCubic),  
    );
    yield* node.opacity(1, duration * 0.8, easeOutCubic);
  }

  // Zoom out to center with fade out
  public static *zoomOutToCenter(node: Node, config: ZoomConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      fromScale = 1,
      toScale = 0,
      overshoot = false,
      easing = overshoot ? easeInBack : easeInCubic,
    } = config;

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Animate to final state
    yield* node.scale(toScale, duration, easing);
    yield* node.opacity(0, duration * 0.8, easeInCubic);
  }

  // Overshoot zoom in with elastic effect
  public static *overshootZoomIn(node: Node, config: ZoomConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION * 1.2,
      delay = this.DEFAULT_DELAY,
      fromScale = 0,
      toScale = 1,
    } = config;

    return yield* this.zoomInFromCenter(node, {
      ...config,
      duration,
      easing: easeOutElastic,
      overshoot: true,
    });
  }

  /**
   * FADE ANIMATIONS
   */

  // Simple fade in
  public static *fadeIn(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      easing = easeOutCubic,
    } = config;

    node.opacity(0);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    yield* node.opacity(1, duration, easing);
  }

  // Simple fade out
  public static *fadeOut(node: Node, config: AnimationConfig = {}) {
    const {
      duration = this.DEFAULT_DURATION,
      delay = this.DEFAULT_DELAY,
      easing = easeInCubic,
    } = config;

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    yield* node.opacity(0, duration, easing);
  }

  // Fade in with overshoot (subtle scale effect)
  public static *fadeInWithOvershoot(node: Node, config: AnimationConfig = {}) {
    const { duration = this.DEFAULT_DURATION, delay = this.DEFAULT_DELAY } =
      config;

    node.opacity(0);
    node.scale(0.8);

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    yield* node.opacity(1, duration, easeOutCubic);
    yield* node.scale(1, duration, easeOutBack);
  }

  /**
   * UTILITY METHODS
   */

  // Sequential animation helper - animate multiple nodes with staggered delays
  public static *staggeredAnimation<T extends Node>(
    nodes: T[],
    animationFn: (node: T, index: number) => ThreadGenerator,
    staggerDelay: number = 0.1,
  ) {
    for (let i = 0; i < nodes.length; i++) {
      if (i > 0) {
        yield* waitFor(staggerDelay);
      }
      yield* animationFn(nodes[i], i);
    }
  }

  // Parallel animation helper - animate multiple nodes simultaneously
  public static *parallelAnimation<T extends Node>(
    nodes: T[],
    animationFn: (node: T, index: number) => ThreadGenerator,
  ) {
    yield* all(...nodes.map((node, index) => animationFn(node, index)));
  }
}

/**
 * Quick access animation functions (shorthand)
 */

// Slide In Shortcuts
export const slideInBottom = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideInFromBottom(node, config);

export const slideInTop = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideInFromTop(node, config);

export const slideInLeft = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideInFromLeft(node, config);

export const slideInRight = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideInFromRight(node, config);

// Slide Out Shortcuts
export const slideOutBottom = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideOutToBottom(node, config);

export const slideOutTop = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideOutToTop(node, config);

export const slideOutLeft = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideOutToLeft(node, config);

export const slideOutRight = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.slideOutToRight(node, config);

// Overshoot Shortcuts
export const overshootBottom = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.overshootSlideInFromBottom(node, config);

export const overshootTop = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.overshootSlideInFromTop(node, config);

export const overshootLeft = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.overshootSlideInFromLeft(node, config);

export const overshootRight = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.overshootSlideInFromRight(node, config);

// Zoom Shortcuts
export const zoomIn = (node: Node, config?: ZoomConfig) =>
  AnimationPresets.zoomInFromCenter(node, config);

export const zoomOut = (node: Node, config?: ZoomConfig) =>
  AnimationPresets.zoomOutToCenter(node, config);

export const overshootZoom = (node: Node, config?: ZoomConfig) =>
  AnimationPresets.overshootZoomIn(node, config);

// Fade Shortcuts
export const fadeIn = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.fadeIn(node, config);

export const fadeOut = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.fadeOut(node, config);

export const fadeInOvershoot = (node: Node, config?: AnimationConfig) =>
  AnimationPresets.fadeInWithOvershoot(node, config);

import {
  Img,
  Node,
  NodeProps,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { all } from '@motion-canvas/core/lib/flow';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import arrowSvg from './media/arrow.svg';

export interface ArrowProps extends NodeProps {
  width?: SignalValue<number>;
  height?: SignalValue<number>;
  color?: SignalValue<PossibleColor>;
}

/**
 * Arrow Component using SVG
 *
 * Creates a right-pointing arrow using the provided SVG design with:
 * - Customizable size
 * - Drop shadow for depth
 * - Smooth animations
 *
 * @example
 * // Basic usage
 * const arrow = new Arrow({
 *   width: 200,
 *   height: 100,
 *   color: '#3FE2E0'
 * });
 *
 * // Animate arrow appearance
 * yield* arrow.opacity(1, 0.5);
 */
export class Arrow extends Node {
  @initial(200)
  @signal()
  declare public readonly width: SimpleSignal<number>;

  @initial(100)
  @signal()
  declare public readonly height: SimpleSignal<number>;

  @initial('#3FE2E0')
  @signal()
  declare public readonly color: SimpleSignal<PossibleColor>;

  private arrowImage: Img;

  public constructor(props?: ArrowProps) {
    super(props);

    // Create the arrow image using the SVG
    this.arrowImage = new Img({
      src: arrowSvg,
      width: () => this.width(),
      opacity: 0,
    });

    // Add the image to the node
    this.add(this.arrowImage);
  }

  // Method to animate arrow fading in
  public *fadeIn(duration: number = 0.5) {
    yield* this.arrowImage.opacity(1, duration);
  }

  // Method to animate arrow fading out
  public *fadeOut(duration: number = 0.5) {
    yield* this.arrowImage.opacity(0, duration);
  }
} 
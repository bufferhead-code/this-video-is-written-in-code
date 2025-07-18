import {
  Img,
  Rect,
  Layout,
  NodeProps,
  Line,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { all, delay } from '@motion-canvas/core/lib/flow';
import { StyledText, StyledTextProps } from './StyledText';
import { ColorType } from '../utils/colors';
import crownSvg from './media/crown.svg';

/**
 * Logo Component with Crown Animation
 *
 * A versatile logo component that supports:
 * - Circular container with drop shadow
 * - Logo image with proper aspect ratio preservation
 * - Cross-out animation for rejection/elimination
 * - Text display with typewriter effect
 * - Crown animation for highlighting/celebration
 *
 * Crown Animation Features:
 * - Fades in/out at the top-right of the logo
 * - Slightly tilted to the right (15° by default)
 * - Custom crown SVG with orange and gold colors
 * - Customizable size and rotation
 *
 * @example
 * // Basic usage with crown
 * const logo = new Logo({
 *   src: 'path/to/logo.svg',
 *   containerSize: 300,
 *   crownSize: 80,
 *   crownRotation: 15
 * });
 *
 * // Show crown animation
 * yield* logo.showCrown(1.0);
 *
 * // Hide crown animation
 * yield* logo.hideCrown(0.5);
 *
 * // Custom crown styling
 * const logoWithCustomCrown = new Logo({
 *   src: 'path/to/logo.svg',
 *   containerSize: 400,
 *   crownSize: 100,
 *   crownRotation: 20
 * });
 */
export interface LogoProps extends NodeProps {
  src?: SignalValue<string>;
  logoWidth?: SignalValue<number>;
  logoHeight?: SignalValue<number>;
  containerSize?: SignalValue<number>; // Single size property for circular container
  shadowColor?: SignalValue<PossibleColor>;
  shadowBlur?: SignalValue<number>;
  shadowOffsetX?: SignalValue<number>;
  shadowOffsetY?: SignalValue<number>;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  // Text properties
  text?: SignalValue<string>;
  textSize?: SignalValue<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;
  textFontSize?: SignalValue<number>;
  textColorType?: SignalValue<ColorType>;
  textOpacity?: SignalValue<number>;
  textOffsetY?: SignalValue<number>; // Offset from bottom center
  // Crown properties
  crownSize?: SignalValue<number>;
  crownRotation?: SignalValue<number>;
}

export class Logo extends Layout {
  @initial('')
  @signal()
  declare public readonly src: SimpleSignal<string>;

  @initial(0) // Will be set in constructor based on container size
  @signal()
  declare public readonly logoWidth: SimpleSignal<number>;

  @initial(0) // Will be set in constructor based on container size
  @signal()
  declare public readonly logoHeight: SimpleSignal<number>;

  @initial(200)
  @signal()
  declare public readonly containerSize: SimpleSignal<number>; // Single size for circular container

  @initial('')
  @signal()
  declare public readonly text: SimpleSignal<string>;

  @initial('lg')
  @signal()
  declare public readonly textSize: SimpleSignal<
    '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'
  >;

  @initial(0)
  @signal()
  declare public readonly textFontSize: SimpleSignal<number>;

  @initial('primary')
  @signal()
  declare public readonly textColorType: SimpleSignal<ColorType>;

  @initial(1)
  @signal()
  declare public readonly textOpacity: SimpleSignal<number>;

  @initial(-40)
  @signal()
  declare public readonly textOffsetY: SimpleSignal<number>;

  @initial(60)
  @signal()
  declare public readonly crownSize: SimpleSignal<number>;

  @initial(15)
  @signal()
  declare public readonly crownRotation: SimpleSignal<number>;

  private container: Rect;
  private logoImg: Img;
  private crossLine1: Line;
  private crossLine2: Line;
  private styledText: StyledText;
  private crown: Img;
  private props: LogoProps;

  public constructor(props?: LogoProps) {
    super({
      ...props,
      size: props?.containerSize,
      // Disable automatic layout behavior to maintain manual positioning
    });
    this.props = props || {};

    // Set default logo dimensions to 60% of container size if not provided
    if (!props?.logoWidth) {
      this.logoWidth(this.containerSize() * 0.6);
    }
    if (!props?.logoHeight) {
      this.logoHeight(this.containerSize() * 0.6);
    }

    this.setupLogo();
  }

  private setupLogo() {
    // Create the white rounded container with drop shadow - always circular
    this.container = new Rect({
      width: this.containerSize, // Use same value for width and height
      height: this.containerSize, // Use same value for width and height
      fill: 'white',
      radius: () => this.containerSize() / 2, // Always half the size for perfect circle
      layout: false,
      shadowColor: this.props.shadowColor ?? 'rgba(0, 0, 0, 0.3)',
      shadowBlur: this.props.shadowBlur ?? 20,
      shadowOffsetX: this.props.shadowOffsetX ?? 0,
      shadowOffsetY: this.props.shadowOffsetY ?? 10,
    });

    // Create the logo image with proper centering and aspect ratio preservation
    this.logoImg = new Img({
      src: this.src,
      // Set width and let Motion Canvas maintain aspect ratio
      width: this.logoWidth(),
      // Center the image within the container
      x: 0,
      y: 0,
    });

    // Create cross lines (initially hidden)
    const crossSize = this.containerSize() * 0.6; // Cross size relative to container
    const halfSize = crossSize / 2;

    this.crossLine1 = new Line({
      points: [
        new Vector2(-halfSize, -halfSize),
        new Vector2(halfSize, halfSize),
      ],
      stroke: '#ff0000',
      lineWidth: 8,
      end: 0,
      zIndex: 10,
    });

    this.crossLine2 = new Line({
      points: [
        new Vector2(halfSize, -halfSize),
        new Vector2(-halfSize, halfSize),
      ],
      stroke: '#ff0000',
      lineWidth: 8,
      end: 0,
      zIndex: 10,
    });

    // Create crown (initially hidden)
    this.crown = new Img({
      src: crownSvg,
      width: this.containerSize() * 0.65,
      opacity: 0,
      zIndex: 20,
      // Position at top right with slight tilt
      y: () => -this.containerSize() * 0.6,
      rotation: 0,
    });

    // Create the styled text component positioned at bottom center
    this.styledText = new StyledText({
      text: this.text,
      size: this.textSize() !== 'sm' ? this.textSize() : undefined,
      fontSize: this.textFontSize() > 0 ? this.textFontSize() : undefined,
      colorType: 'secondary',

      opacity: this.textOpacity,
      y: () => this.containerSize() / 2 + this.textOffsetY(), // Position at bottom center with offset
      x: 0, // Centered horizontally
    });

    // Initially hide the text
    this.styledText.opacity(0);

    // Add the image to the container
    this.container.add(this.logoImg);
    this.container.add(this.crossLine1);
    this.container.add(this.crossLine2);
    this.container.add(this.crown);
    this.container.add(this.styledText);

    this.crossLine1.end(1, 0.8);
    this.crossLine2.end(1, 0.8);

    // Add the container to this layout
    this.add(this.container);
  }

  public *crossOut(duration: number = 0.8) {
    yield* all(
      this.crossLine1.end(1, duration),
      delay(duration * 0.5, this.crossLine2.end(1, duration)),
    );
  }

  // Show the crown with fade-in animation
  /**
   * Shows the crown with a fade-in animation
   * @param duration - Duration of the fade-in animation in seconds (default: 0.8)
   * @example
   * // Show crown with default duration
   * yield* logo.showCrown();
   *
   * // Show crown with custom duration
   * yield* logo.showCrown(1.2);
   */
  public *showCrown(duration: number = 0.8) {
    yield* this.crown.opacity(1, duration);
  }

  // Hide the crown with fade-out animation
  /**
   * Hides the crown with a fade-out animation
   * @param duration - Duration of the fade-out animation in seconds (default: 0.5)
   * @example
   * // Hide crown with default duration
   * yield* logo.hideCrown();
   *
   * // Hide crown with custom duration
   * yield* logo.hideCrown(0.8);
   */
  public *hideCrown(duration: number = 0.5) {
    yield* this.crown.opacity(0, duration);
  }

  // Show the text with optional fade-in animation
  public *showText(duration: number = 0.5) {
    yield* this.styledText.opacity(this.textOpacity(), duration);
  }

  // Hide the text with optional fade-out animation
  public *hideText(duration: number = 0.5) {
    yield* this.styledText.opacity(0, duration);
  }

  // Typewriter effect for the text
  public *typewriteText(text: string, duration: number = 1, delay: number = 0) {
    // Set the text opacity to visible first
    this.styledText.opacity(this.textOpacity());

    // Use the StyledText typewrite method
    yield* this.styledText.typewrite(text, duration, delay);
  }
}

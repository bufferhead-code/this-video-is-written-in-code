import { Rect, Layout, NodeProps, Path } from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import { StyledText } from './StyledText';
import { ColorType } from '../utils/colors';

export interface SpeechBubbleProps extends NodeProps {
  text?: SignalValue<string>;
  textSize?: SignalValue<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;
  textColorType?: SignalValue<ColorType>;
  bubbleWidth?: SignalValue<number>;
  bubbleHeight?: SignalValue<number>;
  bubbleColor?: SignalValue<PossibleColor>;
  bubbleStroke?: SignalValue<PossibleColor>;
  bubbleStrokeWidth?: SignalValue<number>;
  cornerRadius?: SignalValue<number>;
  tailSize?: SignalValue<number>;
  tailPosition?: SignalValue<'bottom-left' | 'bottom-center' | 'bottom-right'>;
  textPadding?: SignalValue<number>;
}

/**
 * Speech Bubble Component
 * 
 * A speech bubble with customizable appearance and text content.
 * Includes a tail pointing downward and supports typewriter text effects.
 */
export class SpeechBubble extends Layout {
  @initial('')
  @signal()
  declare public readonly text: SimpleSignal<string>;

  @initial('md')
  @signal()
  declare public readonly textSize: SimpleSignal<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;

  @initial('primary')
  @signal()
  declare public readonly textColorType: SimpleSignal<ColorType>;

  @initial(300)
  @signal()
  declare public readonly bubbleWidth: SimpleSignal<number>;

  @initial(120)
  @signal()
  declare public readonly bubbleHeight: SimpleSignal<number>;

  @initial('#ffffff')
  @signal()
  declare public readonly bubbleColor: SimpleSignal<PossibleColor>;

  @initial('#cccccc')
  @signal()
  declare public readonly bubbleStroke: SimpleSignal<PossibleColor>;

  @initial(2)
  @signal()
  declare public readonly bubbleStrokeWidth: SimpleSignal<number>;

  @initial(20)
  @signal()
  declare public readonly cornerRadius: SimpleSignal<number>;

  @initial(20)
  @signal()
  declare public readonly tailSize: SimpleSignal<number>;

  @initial('bottom-center')
  @signal()
  declare public readonly tailPosition: SimpleSignal<'bottom-left' | 'bottom-center' | 'bottom-right'>;

  @initial(20)
  @signal()
  declare public readonly textPadding: SimpleSignal<number>;

  private bubblePath: Path;
  private styledText: StyledText;

  public constructor(props?: SpeechBubbleProps) {
    super(props);
    this.setupBubble();
  }

  private setupBubble() {
    // Create the main bubble path (SVG-based, scalable)
    this.bubblePath = new Path({
      fill: this.bubbleColor,
      stroke: this.bubbleStroke,
      lineWidth: this.bubbleStrokeWidth,
      data: () => this.getBubblePath(),
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    });

    // Create the text component
    this.styledText = new StyledText({
      text: '', // Start with empty text, we'll set it after creation
      size: this.textSize,
      colorType: this.textColorType,
      opacity: 1,
      strokeWidth: 0,
      y: -5, // Slight vertical adjustment for better centering
    });

    // Set the initial text value if provided
    const initialText = this.text();
    if (initialText && this.styledText) {
      this.styledText.setText(initialText);
    }

    // Add components to the layout
    this.add(this.bubblePath);
    this.add(this.styledText);
  }

  /**
   * Generate a scalable SVG path for the speech bubble, ensuring true rounded corners and a tail.
   */
  private getBubblePath(): string {
    const w = this.bubbleWidth();
    const h = this.bubbleHeight();
    const r = Math.max(0, Math.min(this.cornerRadius(), w / 2, h / 2));
    // Tail scales with bubble size
    const tailWidthFactor = 0.07; // percent of bubble width
    const tailHeightFactor = 0.2; // percent of bubble height
    const tailW = Math.max(12, w * tailWidthFactor);
    const tailH = Math.max(12, h * tailHeightFactor);
    // Bubble rectangle origin (centered)
    const left = -w / 2;
    const right = w / 2;
    const top = -h / 2;
    const bottom = h / 2;
    const tailPosition = this.tailPosition();
    let tailBaseX1, tailBaseX2, tailBaseY, tailTipX, tailTipY;
    if (tailPosition === 'bottom-center') {
      // Centered tail
      tailBaseX1 = -tailW / 2;
      tailBaseX2 = tailW / 2;
      tailBaseY = bottom;
      tailTipX = 0;
      tailTipY = bottom + tailH;
    } else if (tailPosition === 'bottom-right') {
      // Right tail, mirrored from left
      tailBaseX2 = right - r - 2;
      tailBaseX1 = tailBaseX2 - tailW;
      tailBaseY = bottom;
      tailTipX = tailBaseX2;
      tailTipY = bottom + tailH;
    } else {
      // Default: left tail
      tailBaseX1 = left + r + 2;
      tailBaseX2 = tailBaseX1 + tailW;
      tailBaseY = bottom;
      tailTipX = tailBaseX1;
      tailTipY = bottom + tailH;
    }
    // Start at top-right corner
    let path = [
      // Top edge, right to left
      `M ${right - r} ${top}`,
      `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
      `V ${bottom - r}`,
      `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    ];
    if (tailPosition === 'bottom-center') {
      // Bottom edge to left base, then tail, then right base
      path.push(
        `H ${tailBaseX2}`,
        `L ${tailTipX} ${tailTipY}`,
        `L ${tailBaseX1} ${tailBaseY}`,
        `H ${left + r}`
      );
    } else if (tailPosition === 'bottom-right') {
      // Bottom edge to right base, then tail, then left base
      path.push(
        `H ${tailBaseX2}`,
        `L ${tailTipX} ${tailTipY}`,
        `L ${tailBaseX1} ${tailBaseY}`,
        `H ${left + r}`
      );
    } else {
      // Default: left tail
      path.push(
        `H ${tailBaseX2}`,
        `L ${tailTipX} ${tailTipY}`,
        `L ${tailBaseX1} ${tailBaseY}`,
        `H ${left + r}`
      );
    }
    path.push(
      `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
      `V ${top + r}`,
      `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
      `H ${right - r}`,
      'Z',
    );
    return path.join(' ');
  }

  // Show bubble with fade in
  public *show(duration: number = 0.5) {
    this.opacity(0);
    yield* this.opacity(1, duration);
  }

  // Hide bubble with fade out
  public *hide(duration: number = 0.5) {
    yield* this.opacity(0, duration);
  }

  // Typewriter effect for the text
  public *typewrite(text: string, duration: number = 1, delay: number = 0) {
    // First show the bubble if it's not visible
    if (this.opacity() === 0) {
      yield* this.show(0.3);
    }

    // Use the StyledText typewrite method
    yield* this.styledText.typewrite(text, duration, delay);
  }

  // Typewriter effect with cursor
  public *typewriteWithCursor(text: string, duration: number = 1, delay: number = 0) {
    // First show the bubble if it's not visible
    if (this.opacity() === 0) {
      yield* this.show(0.3);
    }

    // Use the StyledText typewriteWithCursor method
    yield* this.styledText.typewriteWithCursor(text, duration, delay);
  }

  // Clear the text
  public clearText() {
    if (this.styledText) {
      this.styledText.clearText();
    }
    return this;
  }

  // Set text directly
  public setText(text: string) {
    if (this.styledText) {
      this.styledText.setText(text);
    }
    return this;
  }
}
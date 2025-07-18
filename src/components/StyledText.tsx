import { Txt, TxtProps, Node, NodeProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { waitFor } from '@motion-canvas/core';
import { COLORS, ColorType } from '../utils/colors';

const SIZES = {
  '3xl': 192,
  '2xl': 160,
  xl: 128,
  lg: 96,
  md: 80,
  sm: 64,
} as const;

type SizeType = keyof typeof SIZES;

export interface StyledTextProps extends NodeProps {
  colorType?: SignalValue<ColorType>;
  text?: SignalValue<string>;
  size?: SignalValue<SizeType>;
  fontSize?: SignalValue<number>;
  opacity?: SignalValue<number>;
  fixWidth?: SignalValue<boolean>;
}

/**
 * StyledText component with built-in typewriter effects and fixed-width support.
 *
 * The fixWidth feature (enabled by default) prevents centered text from shifting
 * around during typewriter animations by pre-calculating and fixing the text width
 * to the final message length. This is especially useful for maintaining visual
 * stability during text animations.
 */
export class StyledText extends Node {
  @initial('primary')
  @signal()
  declare public readonly colorType: SimpleSignal<ColorType>;

  @initial(true)
  @signal()
  declare public readonly fixWidth: SimpleSignal<boolean>;

  private strokeText: Txt;
  private fillText: Txt;

  public constructor(props?: StyledTextProps) {
    super(props);

    // Determine font size: fontSize prop takes precedence over size prop, default to 'sm'
    const fontSizeValue =
      props?.fontSize ?? SIZES[props?.size as SizeType] ?? SIZES.sm;
    const fontSize =
      typeof fontSizeValue === 'number' ? fontSizeValue : SIZES.sm;

    // Calculate stroke width proportional to font size (approximately 3% of font size)
    const strokeWidth = fontSize * 0.25;

    const baseStyle = {
      fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
      fontSize: fontSizeValue,
      fontWeight: 700,
      fontStyle: 'normal',
      text: props?.text ?? '',
      opacity: () => this.opacity(),
    };

    // Create the stroke text (rendered first, underneath)
    this.strokeText = new Txt({
      ...baseStyle,
      stroke: '#FFFFFF',
      lineWidth: strokeWidth,
      lineJoin: 'round',
      fill: 'rgba(0,0,0,0)',
      shadowColor: '#00000066',
      shadowBlur: 10,
      shadowOffset: { x: 4, y: 4 },
    });

    // Create the fill text (rendered second, on top)
    this.fillText = new Txt({
      ...baseStyle,
      fill: () => {
        const colorType = this.colorType();
        return (
          COLORS[colorType as keyof typeof COLORS] ||
          colorType ||
          COLORS.primary
        );
      },
      stroke: null,
    });

    // Add both texts to this node
    this.add(this.strokeText);
    this.add(this.fillText);
  }

  // Method to update text
  public setText(value: SignalValue<string>) {
    this.strokeText.text(value);
    this.fillText.text(value);

    // Apply fixWidth if enabled (only for string values to avoid signal complications)
    if (typeof value === 'string' && this.fixWidth() && value) {
      const fullTextWidth = this.getTextWidth(value);
      this.strokeText.width(fullTextWidth);
      this.fillText.width(fullTextWidth);
    }

    return this;
  }

  // Method to clear text
  public clearText() {
    this.strokeText.text('');
    this.fillText.text('');
    return this;
  }

  // Typewriter effect - animates text character by character from left to right
  public *typewrite(text: string, duration: number = 1, delay: number = 0) {
    // Clear the text first
    this.strokeText.text('');
    this.fillText.text('');

    // Set text alignment to left for proper left-to-right appearance
    this.strokeText.textAlign('left');
    this.fillText.textAlign('left');

    // Implement fixWidth: measure the full text width and set it from the beginning
    if (this.fixWidth()) {
      const fullTextWidth = this.getTextWidth(text);
      this.strokeText.width(fullTextWidth);
      this.fillText.width(fullTextWidth);
    }

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Calculate time per character
    const timePerChar = duration / text.length;

    // Animate each character
    for (let i = 0; i <= text.length; i++) {
      const currentText = text.substring(0, i);
      const displayText = currentText;

      this.strokeText.text(displayText);
      this.fillText.text(displayText);

      // Wait before showing next character
      if (i < text.length) {
        yield* waitFor(timePerChar);
      }
    }

    return this;
  }

  // Enhanced typewriter effect with cursor that blinks during typing
  public *typewriteWithCursor(
    text: string,
    duration: number = 1,
    delay: number = 0,
  ) {
    // Clear the text first
    this.strokeText.text('');
    this.fillText.text('');

    // Set text alignment to left for proper left-to-right appearance
    this.strokeText.textAlign('left');
    this.fillText.textAlign('left');

    // Implement fixWidth: measure the full text width including cursor space
    if (this.fixWidth()) {
      const fullTextWidth = this.getTextWidth(text + '|');
      this.strokeText.width(fullTextWidth);
      this.fillText.width(fullTextWidth);
    }

    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Calculate time per character
    const timePerChar = duration / text.length;

    // Animate each character with cursor
    for (let i = 0; i <= text.length; i++) {
      const currentText = text.substring(0, i);
      const displayText = currentText + '|';

      this.strokeText.text(displayText);
      this.fillText.text(displayText);

      // Wait before showing next character
      if (i < text.length) {
        yield* waitFor(timePerChar);
      }
    }

    // Blink cursor a few times at the end
    yield* this.blinkCursor(text, 3);

    // Remove cursor at the end
    this.strokeText.text(text);
    this.fillText.text(text);

    return this;
  }

  // Helper method for cursor blinking effect
  private *blinkCursor(baseText: string, blinkCount: number = 3) {
    const blinkDuration = 0.3;

    for (let i = 0; i < blinkCount; i++) {
      // Show cursor
      this.strokeText.text(baseText + '|');
      this.fillText.text(baseText + '|');
      yield* waitFor(blinkDuration);

      // Hide cursor
      this.strokeText.text(baseText);
      this.fillText.text(baseText);
      yield* waitFor(blinkDuration);
    }
  }

  // Helper method to accurately measure text width for fixWidth feature
  private getTextWidth(text: string): number {
    // Create a temporary canvas to measure text accurately
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      // Fallback to simple estimation if canvas is not available
      return text.length * this.strokeText.fontSize() * 0.6;
    }

    // Set the font properties to match our text
    const fontSize = this.strokeText.fontSize();
    context.font = `700 ${fontSize}px "Baloo 2", "Baloo", Arial, sans-serif`;

    // Measure the text width
    const metrics = context.measureText(text);

    // Return the actual width plus a small buffer for accuracy
    return metrics.width;
  }
}

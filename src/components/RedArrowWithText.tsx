import { Layout, LayoutProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { StyledText } from './StyledText';
import { RedArrow } from './RedArrow';
import { ColorType } from '../utils/colors';
import { Node } from '@motion-canvas/2d/lib/components';
import { zoomIn } from '../animation';

export interface RedArrowWithTextProps extends LayoutProps {
  text?: SignalValue<string>;
  textColorType?: SignalValue<ColorType>;
  textSize?: SignalValue<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;
  arrowOpacity?: SignalValue<number>;
}

/**
 * RedArrowWithText component: RedArrow with typewriter text overlay (above arrow by default).
 * Exposes typewrite and clearText methods, and getTextComponent for advanced use.
 */
export class RedArrowWithText extends Layout {
  @initial('')
  @signal()
  declare public readonly text: SimpleSignal<string>;

  @initial('red')
  @signal()
  declare public readonly textColorType: SimpleSignal<ColorType>;

  @initial('lg')
  @signal()
  declare public readonly textSize: SimpleSignal<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;

  @initial(1)
  @signal()
  declare public readonly arrowOpacity: SimpleSignal<number>;

  private styledText: StyledText;
  private redArrow: Node;

  public constructor(props?: RedArrowWithTextProps) {
    super(props);

    // Calculate arrow position and scale internally
    const arrowPos = new Vector2(650, 180);
    const arrowScale = new Vector2(-0.8, 0.8);
    // Calculate text position above the arrow tip
    const textPos = new Vector2(
      arrowPos.x / 6 + 40,
      arrowPos.y + 10
    );

    // Set default rotation
    const rotation = 10;

    this.styledText = new StyledText({
      text: this.text,
      colorType: this.textColorType,
      size: this.textSize(),
      position: textPos,
      opacity: () => this.opacity(),
      rotation: -20,
    });

    this.redArrow = RedArrow({
      position: arrowPos,
      scale: arrowScale,
      opacity: this.arrowOpacity(),
      rotation,
    });

    this.add(this.redArrow);
    this.add(this.styledText);
  }

  /**
   * Typewriter effect for the text above the arrow.
   */
  public *typewrite(text: string, duration: number = 1, delay: number = 0) {
    yield* this.styledText.typewrite(text, duration, delay);
    return this;
  }

  /**
   * Clear the text.
   */
  public clearText() {
    this.styledText.clearText();
    return this;
  }

  /**
   * Get the StyledText component for advanced use.
   */
  public getTextComponent(): StyledText {
    return this.styledText;
  }

  /**
   * Get the RedArrow component for advanced use.
   */
  public getArrowComponent(): Node {
    return this.redArrow;
  }

  /**
   * Animate the scale in of the arrow and text.
   */
  public *scaleIn(duration: number = 1) {
    // Animate both arrow and text scaling from 0 to 1
    // Use scale property of Layout (this), so both children scale together
    yield* this.redArrow.opacity(1, duration);
    return this;
  }
} 
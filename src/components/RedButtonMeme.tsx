import { Layout, Img, LayoutProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { StyledText } from './StyledText';
import { MEME_STYLE } from './MemeStyle';
import { ColorType } from '../utils/colors';
import redButtonMeme from './media/red-button-meme.jpg';

export interface RedButtonMemeProps extends LayoutProps {
  imageSize?: SignalValue<Vector2>;
  text?: SignalValue<string>;
  textColorType?: SignalValue<ColorType>;
  textSize?: SignalValue<'3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'>;
  textPosition?: SignalValue<Vector2>;
}

/**
 * RedButtonMeme component that displays the red button meme image with typewriter text overlay.
 *
 * This component combines the meme image display with StyledText's typewriter functionality,
 * allowing you to animate text appearing over the meme image.
 */
export class RedButtonMeme extends Layout {
  @initial([1200, 800])
  @signal()
  declare public readonly imageSize: SimpleSignal<Vector2>;

  @initial('')
  @signal()
  declare public readonly text: SimpleSignal<string>;

  @initial('primary')
  @signal()
  declare public readonly textColorType: SimpleSignal<ColorType>;

  @initial('md')
  @signal()
  declare public readonly textSize: SimpleSignal<
    '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'
  >;

  private memeImg: Img;
  private styledText: StyledText;

  public constructor(props?: RedButtonMemeProps) {
    super(props);

    // Create the meme image
    this.memeImg = new Img({
      src: redButtonMeme,
      size: this.imageSize,
      ...MEME_STYLE,
    });

    // Create the styled text overlay
    this.styledText = new StyledText({
      text: this.text,
      colorType: this.textColorType,
      size: this.textSize,
      position: [-230, 80],
      rotation: 20,
    });

    // Add both components to the layout
    this.add(this.memeImg);
    this.add(this.styledText);
  }

  /**
   * Typewriter effect - animates text character by character over the meme
   */
  public *typewrite(text: string, duration: number = 1, delay: number = 0) {
    yield* this.styledText.typewrite(text, duration, delay);
    return this;
  }

  /**
   * Clear the text
   */
  public clearText() {
    this.styledText.clearText();
    return this;
  }

  /**
   * Get the styled text component for direct access to more advanced features
   */
  public getTextComponent(): StyledText {
    return this.styledText;
  }

  /**
   * Get the image component for direct access to image properties
   */
  public getImageComponent(): Img {
    return this.memeImg;
  }
}

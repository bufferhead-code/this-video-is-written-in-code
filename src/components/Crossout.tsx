import { Node, Line, NodeProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor, Vector2 } from '@motion-canvas/core';
import { all, waitFor, tween } from '@motion-canvas/core';
import { easeOutCubic, easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { StyledText } from './StyledText';

export interface CrossoutProps extends NodeProps {
  width?: SignalValue<number>;
  strokeColor?: SignalValue<PossibleColor>;
  strokeWidth?: SignalValue<number>;
  text?: SignalValue<string>;
  textSize?: SignalValue<number>;
  textOffset?: SignalValue<number>;
  textPosition?: SignalValue<'above' | 'below'>;
  animationDuration?: SignalValue<number>;
}

export class Crossout extends Node {
  @initial('#ff0000')
  @signal()
  declare public readonly strokeColor: SimpleSignal<PossibleColor>;

  @initial(12)
  @signal()
  declare public readonly strokeWidth: SimpleSignal<number>;

  @initial(300)
  @signal()
  declare public readonly width: SimpleSignal<number>;

  @initial('')
  @signal()
  declare public readonly text: SimpleSignal<string>;

  @initial(24)
  @signal()
  declare public readonly textSize: SimpleSignal<number>;

  @initial(80)
  @signal()
  declare public readonly textOffset: SimpleSignal<number>;

  @initial('below')
  @signal()
  declare public readonly textPosition: SimpleSignal<'above' | 'below'>;

  @initial(0.3)
  @signal()
  declare public readonly animationDuration: SimpleSignal<number>;

  private crossoutLine: Line;
  private crossoutText?: StyledText;

  public constructor(props?: CrossoutProps) {
    super(props);

    // Create the strike-through line
    this.crossoutLine = new Line({
      points: [],
      stroke: this.strokeColor,
      lineWidth: this.strokeWidth,
      lineCap: 'round',
      opacity: 0,
    });

    // Create optional text above or below if provided
    if (this.text() && this.text().trim() !== '') {
      const yPosition = this.textPosition() === 'above' ? -this.textOffset() : this.textOffset();
      this.crossoutText = new StyledText({
        text: this.text,
        fontSize: this.textSize,
        colorType: 'danger',
        position: [0, yPosition],
        opacity: 0,
        strokeWidth: 0,
        textAlign: 'left',
        fixWidth: true,
      });
      this.add(this.crossoutText);
    }

    this.add(this.crossoutLine);
  }

  // Animate the crossout line from left to right
  public *animateCrossout(delay: number = 0) {
    const lineWidth = this.width();
    const startPoint = new Vector2(-lineWidth / 2, 0);
    const endPoint = new Vector2(lineWidth / 2, 0);

    // Wait for initial delay
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Set initial line state - start from left point
    this.crossoutLine.points([startPoint, startPoint]);
    this.crossoutLine.opacity(1);

    // Animate line drawing from left to right
    yield* tween(this.animationDuration(), (value) => {
      const currentEndPoint = Vector2.lerp(startPoint, endPoint, value);
      this.crossoutLine.points([startPoint, currentEndPoint]);
    });
  }

  // Animate the text appearing above or below (if text is provided)
  public *animateText(delay: number = 0) {
    if (!this.crossoutText) return;

    // Wait for initial delay
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Make text visible first
    this.crossoutText.opacity(1);
    
    // Animate text typewriter effect
    yield* this.crossoutText.typewrite(this.text(), this.animationDuration() * 1.2);
  }

  // Combined animation - crossout line followed by text
  public *animateComplete(lineDelay: number = 0, textDelay: number = 0.2) {
    yield* this.animateCrossout(lineDelay);
    
    if (this.crossoutText) {
      yield* this.animateText(textDelay);
    }
  }

  // Alternative: animate both simultaneously
  public *animateSimultaneous(delay: number = 0) {
    if (delay > 0) {
      yield* waitFor(delay);
    }

    const animations = [this.animateCrossout(0)];
    
    if (this.crossoutText) {
      animations.push(this.animateText(0.1));
    }

    yield* all(...animations);
  }

  // Method to update text dynamically
  public updateText(newText: string) {
    this.text(newText);
    
    if (newText && newText.trim() !== '') {
      if (!this.crossoutText) {
        const yPosition = this.textPosition() === 'above' ? -this.textOffset() : this.textOffset();
        this.crossoutText = new StyledText({
          text: newText,
          fontSize: this.textSize,
          colorType: 'danger',
          position: [0, yPosition],
          opacity: 0,
          strokeWidth: 0,
          textAlign: 'left',
          fixWidth: true,
        });
        this.add(this.crossoutText);
      } else {
        this.crossoutText.setText(newText);
      }
    } else if (this.crossoutText) {
      this.crossoutText.remove();
      this.crossoutText = undefined;
    }
  }

  // Method to reset the animation
  public reset() {
    this.crossoutLine.opacity(0);
    this.crossoutLine.points([]);
    
    if (this.crossoutText) {
      this.crossoutText.opacity(0);
      this.crossoutText.clearText();
    }
  }

  // Method to set crossout style properties
  public setCrossoutStyle(properties: {
    color?: PossibleColor;
    width?: number;
    strokeWidth?: number;
    textSize?: number;
    textOffset?: number;
    textPosition?: 'above' | 'below';
  }) {
    if (properties.color !== undefined) {
      this.strokeColor(properties.color);
    }
    if (properties.width !== undefined) {
      this.width(properties.width);
    }
    if (properties.strokeWidth !== undefined) {
      this.strokeWidth(properties.strokeWidth);
    }
    if (properties.textSize !== undefined) {
      this.textSize(properties.textSize);
      if (this.crossoutText) {
        // Remove old text component and create new one with updated size
        const currentOpacity = this.crossoutText.opacity();
        this.crossoutText.remove();
        const yPosition = this.textPosition() === 'above' ? -this.textOffset() : this.textOffset();
        this.crossoutText = new StyledText({
          text: this.text,
          fontSize: properties.textSize,
          colorType: 'danger',
          position: [0, yPosition],
          opacity: currentOpacity,
          strokeWidth: 0,
          textAlign: 'left',
          fixWidth: true,
        });
        this.add(this.crossoutText);
      }
    }
    if (properties.textOffset !== undefined) {
      this.textOffset(properties.textOffset);
      if (this.crossoutText) {
        const yPosition = this.textPosition() === 'above' ? -properties.textOffset : properties.textOffset;
        this.crossoutText.position([0, yPosition]);
      }
    }
    if (properties.textPosition !== undefined) {
      this.textPosition(properties.textPosition);
      if (this.crossoutText) {
        const yPosition = properties.textPosition === 'above' ? -this.textOffset() : this.textOffset();
        this.crossoutText.position([0, yPosition]);
      }
    }
  }
}
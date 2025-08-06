import { Rect, LayoutProps, Layout } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Color, Vector2, PossibleColor } from '@motion-canvas/core';
import { all, waitFor, tween } from '@motion-canvas/core';
import { COLORS } from '../utils/colors';
import { playHighlighter } from '../soundeffects';

export interface TextMarkerProps extends LayoutProps {
  markerColor?: SignalValue<PossibleColor>;
  markerOpacity?: SignalValue<number>;
  animationDuration?: SignalValue<number>;
  markerThickness?: SignalValue<number>;
  debugMode?: SignalValue<boolean>;
  markerCompositeOperation?: SignalValue<GlobalCompositeOperation>;
}

export class TextMarker extends Layout {
  @initial(COLORS.secondary)
  @signal()
  declare public readonly markerColor: SimpleSignal<PossibleColor>;

  @initial(0.6)
  @signal()
  declare public readonly markerOpacity: SimpleSignal<number>;

  @initial(1)
  @signal()
  declare public readonly animationDuration: SimpleSignal<number>;

  @initial(0)
  @signal()
  declare public readonly markerThickness: SimpleSignal<number>;

  @initial(false)
  @signal()
  declare public readonly debugMode: SimpleSignal<boolean>;

  @initial('lighter')
  @signal()
  declare public readonly markerCompositeOperation: SimpleSignal<GlobalCompositeOperation>;

  private markerNode: Rect;

  public constructor(props?: TextMarkerProps) {
    super(props);

    if (this.debugMode()) {
      console.log(`Creating marker at position:`, {
        x: this.x(),
        y: this.y(),
        width: this.width(),
        height: this.height(),
      });
    }

    // Create marker rectangle using Layout's dimensions
    this.markerNode = new Rect({
      width: () => this.width() + this.markerThickness() * 2,
      height: () => this.height() + this.markerThickness() * 2,
      x: 0, // Relative to this Layout
      y: 0, // Relative to this Layout
      fill: this.markerColor,
      opacity: 0, // Start invisible for animation
      radius: 4,
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowBlur: 6,
      shadowOffset: new Vector2(2, 2),
      compositeOperation: this.markerCompositeOperation(),
    });

    this.add(this.markerNode);
  }

  // Animation method: marker pen style (draws from left to right)
  public *animateMarkerPen(delay: number = 0) {
    yield* waitFor(delay);
    playHighlighter();
    yield* this.animateSingleMarkerPen(this.markerNode);
  }

  private *animateSingleMarkerPen(marker: Rect) {
    // Start with zero width and grow to full width (like drawing with a marker)
    const originalWidth = marker.width();
    const originalX = marker.x();

    // Calculate the left edge position
    const leftEdge = originalX - originalWidth / 2;

    // Start with zero width at the left edge
    marker.width(0);
    marker.x(leftEdge);
    marker.opacity(this.markerOpacity());

    yield* tween(this.animationDuration(), (value) => {
      const currentWidth = originalWidth * value;
      marker.width(currentWidth);
      // Position the marker so it grows from left to right
      marker.x(leftEdge + currentWidth / 2);
    });
  }

  // Animation method: fade in effect
  public *animateFadeIn(delay: number = 0) {
    yield* waitFor(delay);
    playHighlighter();
    yield* this.markerNode.opacity(
      this.markerOpacity(),
      this.animationDuration(),
    );
  }

  // Animation method: typewriter style (appears as text is "detected")
  public *animateTypewriter(delay: number = 0, characterDelay: number = 0.05) {
    yield* waitFor(delay);
    playHighlighter();

    // Use Layout dimensions for estimation
    const estimatedTextLength = Math.floor(this.width() / 10) || 10; // Rough estimate
    const duration = estimatedTextLength * characterDelay;

    this.markerNode.opacity(0);
    yield* this.markerNode.opacity(this.markerOpacity(), duration);
  }

  // Animation method: pulse effect
  public *animatePulse(delay: number = 0, pulseCount: number = 2) {
    yield* waitFor(delay);
    playHighlighter();

    for (let i = 0; i < pulseCount; i++) {
      yield* this.markerNode.opacity(this.markerOpacity(), 0.3);
      yield* this.markerNode.opacity(this.markerOpacity() * 0.3, 0.3);
    }

    // End with full opacity
    yield* this.markerNode.opacity(this.markerOpacity(), 0.3);
  }

  public dispose() {
    this.markerNode.remove();
  }

  // Helper method to set marker properties
  public setMarkerStyle(properties: {
    color?: PossibleColor;
    opacity?: number;
    thickness?: number;
    compositeOperation?: GlobalCompositeOperation;
  }) {
    if (properties.color !== undefined) {
      this.markerColor(properties.color);
      this.markerNode.fill(properties.color);
    }
    if (properties.opacity !== undefined) {
      this.markerOpacity(properties.opacity);
      this.markerNode.opacity(properties.opacity);
    }
    if (properties.thickness !== undefined) {
      this.markerThickness(properties.thickness);
    }
    if (properties.compositeOperation !== undefined) {
      this.markerCompositeOperation(properties.compositeOperation);
      this.markerNode.compositeOperation(properties.compositeOperation);
    }
  }
}

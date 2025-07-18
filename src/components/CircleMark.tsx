import {
  Node,
  Spline,
  Knot,
  NodeProps,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor, Vector2 } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core';

export interface CircleMarkProps extends NodeProps {
  size?: SignalValue<number>;
  strokeColor?: SignalValue<PossibleColor>;
  strokeWidth?: SignalValue<number>;
  handDrawnStyle?: SignalValue<boolean>;
  gapSize?: SignalValue<number>;
}

export class CircleMark extends Node {
  @initial(200)
  @signal()
  declare public readonly size: SimpleSignal<number>;

  @initial('#E53E3E')
  @signal()
  declare public readonly strokeColor: SimpleSignal<PossibleColor>;

  @initial(8)
  @signal()
  declare public readonly strokeWidth: SimpleSignal<number>;

  @initial(true)
  @signal()
  declare public readonly handDrawnStyle: SimpleSignal<boolean>;

  @initial(0.1)
  @signal()
  declare public readonly gapSize: SimpleSignal<number>;

  @initial(0)
  @signal()
  declare public readonly drawProgress: SimpleSignal<number>;

  private splineElement: Spline;

  public constructor(props?: CircleMarkProps) {
    super(props);

    // Create the spline-based hand-drawn circle
    this.splineElement = new Spline({
      lineWidth: () => this.strokeWidth(),
      stroke: () => this.strokeColor(),
      lineCap: 'round',
      lineJoin: 'round',
      start: 0,
      end: () => this.drawProgress(),
      closed: false, // Keep open to create the hand-drawn gap effect
      smoothness: 0.6, // Good smoothness for natural curves
    });

    // Generate knots for the circle
    this.updateKnots();
    this.add(this.splineElement);
  }

  private updateKnots(): void {
    const scale = this.size() / 374; // Scale based on original SVG viewBox width
    const knots: Knot[] = [];

    if (this.handDrawnStyle()) {
      // Use the authentic hand-drawn path points from the SVG
      // Original SVG viewBox: 374x330, we'll center it and scale it
      const centerOffsetX = -187; // Half of 374
      const centerOffsetY = -165; // Half of 330

      // Key points extracted from the SVG path data
      const pathPoints = [
        // Start point: M21.0819 78.9353
        {
          pos: [21.0819 + centerOffsetX, 78.9353 + centerOffsetY],
          controls: [],
        },

        // First curve end point: C35.1467 52.9155 90.8431 0.875977 201.111 0.875977
        {
          pos: [201.111 + centerOffsetX, 0.875977 + centerOffsetY],
          controls: [
            35.1467 + centerOffsetX,
            52.9155 + centerOffsetY,
            90.8431 + centerOffsetX,
            0.875977 + centerOffsetY,
          ],
        },

        // Second curve end point: C338.945 0.875977 373.404 114.097 373.404 178.092
        {
          pos: [373.404 + centerOffsetX, 178.092 + centerOffsetY],
          controls: [
            338.945 + centerOffsetX,
            0.875977 + centerOffsetY,
            373.404 + centerOffsetX,
            114.097 + centerOffsetY,
          ],
        },

        // Third curve end point: C373.404 242.086 270.028 329.288 160.323 329.288
        {
          pos: [160.323 + centerOffsetX, 329.288 + centerOffsetY],
          controls: [
            373.404 + centerOffsetX,
            242.086 + centerOffsetY,
            270.028 + centerOffsetX,
            329.288 + centerOffsetY,
          ],
        },

        // Fourth curve end point: C50.6178 329.288 0.687988 242.086 0.687988 185.124
        {
          pos: [0.687988 + centerOffsetX, 185.124 + centerOffsetY],
          controls: [
            50.6178 + centerOffsetX,
            329.288 + centerOffsetY,
            0.687988 + centerOffsetX,
            242.086 + centerOffsetY,
          ],
        },

        // Fifth curve end point: C0.687988 139.554 59.76 77.0601 89.296 51.5091
        {
          pos: [89.296 + centerOffsetX, 51.5091 + centerOffsetY],
          controls: [
            0.687988 + centerOffsetX,
            139.554 + centerOffsetY,
            59.76 + centerOffsetX,
            77.0601 + centerOffsetY,
          ],
        },
      ];

      pathPoints.forEach((point, index) => {
        const scaledPos = [point.pos[0] * scale, point.pos[1] * scale];

        let startHandle = undefined;
        let endHandle = undefined;

        // Use control points from the previous curve as start handle
        if (index > 0) {
          const prevPoint = pathPoints[index - 1];
          if (prevPoint.controls.length >= 4) {
            const controlX = prevPoint.controls[2] * scale;
            const controlY = prevPoint.controls[3] * scale;
            startHandle = new Vector2(
              controlX - scaledPos[0],
              controlY - scaledPos[1],
            );
          }
        }

        // Use first control point of current curve as end handle
        if (point.controls.length >= 2) {
          const controlX = point.controls[0] * scale;
          const controlY = point.controls[1] * scale;
          endHandle = new Vector2(
            controlX - scaledPos[0],
            controlY - scaledPos[1],
          );
        }

        knots.push(
          new Knot({
            position: new Vector2(scaledPos[0], scaledPos[1]),
            startHandle: startHandle,
            endHandle: endHandle,
          }),
        );
      });
    } else {
      // Perfect circle fallback
      const radius = this.size() / 2;
      const numKnots = 8;

      for (let i = 0; i < numKnots; i++) {
        const angle = (i / numKnots) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        knots.push(
          new Knot({
            position: new Vector2(x, y),
          }),
        );
      }
    }

    this.splineElement.removeChildren();
    this.splineElement.add(knots);
  }

  /**
   * Animates the drawing of the circle mark
   * @param duration Duration of the animation in seconds
   * @param delay Delay before starting the animation in seconds
   */
  public *drawCircle(
    duration: number = 1.5,
    delay: number = 0,
  ): Generator<any, void, any> {
    yield* waitFor(delay);
    yield* this.drawProgress(1, duration);
  }

  /**
   * Instantly shows the complete circle mark
   */
  public showComplete(): void {
    this.drawProgress(1);
  }

  /**
   * Hides the circle mark
   */
  public hide(): void {
    this.opacity(0);
  }

  /**
   * Shows the circle mark
   */
  public show(): void {
    this.opacity(1);
  }

  /**
   * Updates the circle when properties change
   */
  public updateCircle(): void {
    this.updateKnots();
  }
}

// Functional component version for convenience
export function CircleMarkComponent(props: CircleMarkProps) {
  return <CircleMark {...props} />;
}

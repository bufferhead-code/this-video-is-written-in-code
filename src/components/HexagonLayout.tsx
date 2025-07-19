import { Path, Node, NodeProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { tween } from '@motion-canvas/core/lib/tweening';
import { linear } from '@motion-canvas/core/lib/tweening';
import { StyledText } from './StyledText';

export interface HexagonLayoutProps extends NodeProps {
  hexagonRadius?: SignalValue<number>;
  hexagonColor?: SignalValue<string>;
  hexagonStroke?: SignalValue<string>;
  hexagonLineWidth?: SignalValue<number>;
  spacing?: SignalValue<number>;
}

/**
 * HexagonLayout component that creates 5 hexagons arranged in a pattern
 * with a center hexagon and 4 surrounding hexagons.
 */
export class HexagonLayout extends Node {
  @initial(80)
  @signal()
  declare public readonly hexagonRadius: SimpleSignal<number>;

  @initial('#333333')
  @signal()
  declare public readonly hexagonColor: SimpleSignal<string>;

  @initial('#ffffff')
  @signal()
  declare public readonly hexagonStroke: SimpleSignal<string>;

  @initial(3)
  @signal()
  declare public readonly hexagonLineWidth: SimpleSignal<number>;

  @initial(40)
  @signal()
  declare public readonly spacing: SimpleSignal<number>;

  private hexagons: Path[] = [];
  private numbers: StyledText[] = [];

  public constructor(props?: HexagonLayoutProps) {
    super(props);
    this.createHexagons();
  }

  private createHexagons() {
    const positions = this.getHexagonPositions();

    for (let i = 0; i < 5; i++) {
      // Create hexagon shape using Path
      const hexagon = new Path({
        fill: () => this.hexagonColor(),
        stroke: () => this.hexagonStroke(),
        lineWidth: () => this.hexagonLineWidth(),
        opacity: 0,
        scale: 0,
        position: positions[i],
        data: () => this.createHexagonPath(this.hexagonRadius()),
      });

      // Create number text
      const numberText = new StyledText({
        text: (i + 1).toString(),
        colorType: 'white',
        size: 'lg',
        position: positions[i],
        opacity: 0,
        scale: 0,
      });

      this.hexagons.push(hexagon);
      this.numbers.push(numberText);

      this.add(hexagon);
      this.add(numberText);
    }
  }

  private createHexagonPath(radius: number): string {
    const points: Vector2[] = [];
    
    // Create 6 points for a regular hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3; // 60 degrees per side
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new Vector2(x, y));
    }
    
    // Create SVG path string
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ' Z'; // Close the path
    
    return path;
  }

  private getHexagonPositions(): Vector2[] {
    const spacing = () => this.spacing();
    const radius = () => this.hexagonRadius();
    
    // Calculate distance from center to surrounding hexagons
    const distance = radius() * 2 + spacing();

    return [
      new Vector2(0, 0), // Center hexagon
      new Vector2(0, -distance), // Top
      new Vector2(distance * Math.cos(Math.PI / 6), distance * Math.sin(Math.PI / 6)), // Top right
      new Vector2(distance * Math.cos(Math.PI / 6), -distance * Math.sin(Math.PI / 6)), // Bottom right
      new Vector2(-distance * Math.cos(Math.PI / 6), -distance * Math.sin(Math.PI / 6)), // Bottom left
    ];
  }

  /**
   * Animates the hexagons appearing one by one with numbers
   */
  public *animateIn(duration: number = 1, stagger: number = 0.2) {
    for (let i = 0; i < this.hexagons.length; i++) {
      const hexagon = this.hexagons[i];
      const numberText = this.numbers[i];

      // Animate hexagon appearing
      yield* tween(duration, (value: number) => {
        hexagon.opacity(linear(value, 0, 1));
        hexagon.scale(linear(value, 0, 1));
      });

      // Animate number appearing slightly after hexagon
      yield* tween(duration * 0.5, (value: number) => {
        numberText.opacity(linear(value, 0, 1));
        numberText.scale(linear(value, 0, 1));
      });

      // Wait before next hexagon if not the last one
      if (i < this.hexagons.length - 1) {
        yield* tween(stagger, () => {});
      }
    }
  }

  /**
   * Animates all hexagons appearing simultaneously
   */
  public *animateInTogether(duration: number = 1) {
    yield* tween(duration, (value: number) => {
      for (let i = 0; i < this.hexagons.length; i++) {
        const hexagon = this.hexagons[i];
        const numberText = this.numbers[i];
        
        hexagon.opacity(linear(value, 0, 1));
        hexagon.scale(linear(value, 0, 1));
        numberText.opacity(linear(value, 0, 1));
        numberText.scale(linear(value, 0, 1));
      }
    });
  }

  /**
   * Animates the hexagons disappearing
   */
  public *animateOut(duration: number = 1) {
    yield* tween(duration, (value: number) => {
      for (let i = 0; i < this.hexagons.length; i++) {
        const hexagon = this.hexagons[i];
        const numberText = this.numbers[i];
        
        hexagon.opacity(linear(value, 1, 0));
        hexagon.scale(linear(value, 1, 0));
        numberText.opacity(linear(value, 1, 0));
        numberText.scale(linear(value, 1, 0));
      }
    });
  }
}
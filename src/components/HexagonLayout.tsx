import { Node, NodeProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Vector2 } from '@motion-canvas/core/lib/types';

export interface HexagonLayoutProps extends NodeProps {
  spacing?: SignalValue<number>;
  rotation?: SignalValue<number>;
}

/**
 * HexagonLayout component that arranges child elements in a pentagon pattern.
 * Elements are positioned but not created by this component.
 */
export class HexagonLayout extends Node {
  @initial(150)
  @signal()
  declare public readonly spacing: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  declare public readonly rotation: SimpleSignal<number, this>;

  public constructor(props?: HexagonLayoutProps) {
    super(props);
  }


  /**
   * Get the positions for elements in a pentagon formation
   */
  public getPositions(): Vector2[] {
    const spacing = this.spacing();
    const rotation = this.rotation();

    // spacing is the distance from center to each element
    const distance = spacing;
    const positions: Vector2[] = [];

    // Create 5 positions in a pentagon formation
    for (let i = 0; i < 5; i++) {
      // Pentagon has 5 sides, so each angle is 2π/5 = 72 degrees
      // Start from top (subtract π/2 to rotate to start at top)
      // Add rotation to base angle (convert degrees to radians)
      const baseAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const angle = baseAngle + (rotation * Math.PI) / 180;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      positions.push(new Vector2(x, y));
    }

    return positions;
  }

}

import { NodeProps, Rect } from '@motion-canvas/2d';
import { Path, Node } from '@motion-canvas/2d/lib/components';
import { Gradient } from '@motion-canvas/2d/lib/partials';
import { Vector2 } from '@motion-canvas/core';

export interface RedArrowProps extends NodeProps {
  // Use scale/position/opacity for sizing/placement
}

/**
 * RedArrow component - renders the custom arrow SVG as a Path.
 * Sizing: Use scale prop to resize. Use position/opacity for placement/animation.
 * Example: <RedArrow scale={0.2} position={[x, y]} opacity={0.8} />
 *
 * Now includes a horizontal gradient overlay that fades out to the right.
 */
export function RedArrow(props: RedArrowProps) {
  const pathData =
    "M165.974 240.661C176.711 246.288 189.976 242.144 195.604 231.405L229.35 166.997C263.635 247.933 348.008 300.718 439.767 290.914C507.307 283.696 566.754 243.57 598.783 183.576C604.492 172.881 600.451 159.583 589.757 153.874C579.062 148.166 565.765 152.206 560.058 162.901C534.884 210.055 488.174 241.589 435.105 247.261C362.611 255.006 295.983 213.031 269.34 148.838L340.529 186.136C351.265 191.761 364.532 187.618 370.158 176.878C375.784 166.14 371.64 152.875 360.902 147.249L246.36 87.237C240.991 84.4239 234.99 84.0542 229.629 85.7289C224.269 87.4036 219.544 91.124 216.731 96.4932L156.72 211.03C151.092 221.769 155.236 235.035 165.974 240.661Z";

  // The bounding box for the gradient overlay (should match the arrow's width)
  const gradientFrom = new Vector2(160, 0); // leftmost x in pathData
  const gradientTo = new Vector2(600, 0);   // rightmost x in pathData

  return (
    <Node cache {...props}>
      {/* Bottom Path: White stroke outline */}
      <Path
        data={pathData}
        fill="rgba(0,0,0,0)"
        stroke="white"
        lineWidth={50}
        lineJoin="round"
      />
      {/* Top Path: Red fill, no stroke */}
      <Path
        data={pathData}
        fill="#FF2E00"
        stroke={null}
        lineWidth={0}
      />
      {/* Gradient overlay for fade-out effect */}
      <Rect
        width={'100%'}
        height={'100%'}
        rotation={-20}
        fill={new Gradient({
          type: 'linear',
          from: gradientFrom,
          to: gradientTo,
          stops: [
            { offset: 0.2, color: 'rgba(255,255,255,1)' }, // opaque left
            { offset: 0.3, color: 'rgba(255,255,255,1)' }, // opaque left
            { offset: 1, color: 'rgba(255,255,255,0)' }, // transparent right
          ],
        })}
        stroke={null}
        lineWidth={0}
        compositeOperation="destination-in" // Only show where both arrow and gradient exist
      />
    </Node>
  );
} 
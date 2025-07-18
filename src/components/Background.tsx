import {Img} from '@motion-canvas/2d';
import backgroundSvg from './media/background.svg';

export function Background() {
  return (
    <Img
      src={backgroundSvg}
      width={1920}
      height={1080}
      x={0}
      y={0}
    />
  );
} 
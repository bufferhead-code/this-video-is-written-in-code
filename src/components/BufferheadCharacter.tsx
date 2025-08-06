import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import bufferheadIdle from './media/bufferhead_idle.svg';

export interface BufferheadCharacterProps extends ImgProps {}

/**
 * BufferheadCharacter component - displays the Bufferhead character SVG as an Img
 */
export function BufferheadCharacter(props: BufferheadCharacterProps) {
  return (
    <Img
      src={bufferheadIdle}
      {...props}
    />
  );
}
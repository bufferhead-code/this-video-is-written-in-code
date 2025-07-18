import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import { MEME_STYLE } from './MemeStyle';
import automationMeme from '../images/automation-meme.png';

export const MemeImage = (props: ImgProps) => {
  return <Img src={automationMeme} {...MEME_STYLE} {...props} />;
};

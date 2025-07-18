import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import rainbowBackground from '../images/rainbow-background.jpg';

export const RainbowBackground = (props: ImgProps) => {
  return <Img src={rainbowBackground} {...props} />;
};

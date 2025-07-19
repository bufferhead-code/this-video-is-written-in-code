import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import blueprintImage from './media/blueprint.jpg';

export const BlueprintBackground = (props: ImgProps) => {
  return <Img src={blueprintImage} {...props} />;
};
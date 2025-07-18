import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import premierePro from '../images/premiere-pro.png';

export const PremiereProWindow = (props: ImgProps) => {
  return <Img src={premierePro} {...props} radius={10} />;
};

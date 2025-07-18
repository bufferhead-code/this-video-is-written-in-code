import { Img, ImgProps } from '@motion-canvas/2d/lib/components';
import { NodeProps } from '@motion-canvas/2d/lib/components/Node';
import adobePricing from '../images/adobe-pricing.png';
import { Browser, BrowserProps } from './Browser';
import { TextMarker } from './TextMarker';

export const PricingPage = (props: BrowserProps) => {
  const { width = 1200, height = 700, ...otherProps } = props;
  return (
    <Browser
      {...otherProps}
      width={width}
      height={height}
      screenshotSrc={adobePricing}
      screenshotDelay={0.5}
    >
      <TextMarker
        markerColor="#FF6B6B"
        markerOpacity={0.8}
        animationDuration={1.5}
        markerThickness={6}
        debugMode={false}
        x={200}
        y={200}
        width={100}
        height={100}
      />
    </Browser>
  );
};

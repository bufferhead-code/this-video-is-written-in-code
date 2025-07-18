import { Rect, Txt, TxtProps } from '@motion-canvas/2d/lib/components';

export interface StampProps extends TxtProps {
  text: string;
}

export const Stamp = ({ text, ...props }: StampProps) => {
  return (
    <Rect rotation={-15} stroke={'red'} lineWidth={5} padding={20} radius={10}>
      <Txt fill={'red'} fontSize={80} fontWeight={900} {...props}>
        {text}
      </Txt>
    </Rect>
  );
};

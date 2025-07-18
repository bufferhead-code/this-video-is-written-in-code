import { Txt, Rect, Layout, RectProps } from '@motion-canvas/2d/lib/components';

export interface PseudoCodeProps extends RectProps {
  code: string;
}

export const PseudoCode = ({ code, ...props }: PseudoCodeProps) => {
  return (
    <Rect layout direction={'column'} fill={'#242424'} padding={20} radius={10} {...props}>
      {code.split('\n').map((line, index) => (
        <Txt key={index.toString()} fill={'#fff'} fontFamily={'monospace'} fontSize={40}>
          {line}
        </Txt>
      ))}
    </Rect>
  );
};

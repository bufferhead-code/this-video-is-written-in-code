import { Rect, Txt, RectProps } from '@motion-canvas/2d/lib/components';
import { Gradient } from '@motion-canvas/2d/lib/partials';

export interface MacButtonProps extends RectProps {
  text: string;
  lightMode?: boolean;
}

export const MacButton = (props: MacButtonProps) => {
  const { text, lightMode = false, ...rectProps } = props;

  return (
    <Rect
      {...rectProps}
      layout
      justifyContent={'center'}
      alignItems={'center'}
      fill={
        lightMode
          ? new Gradient({
              type: 'linear',
              from: [0, -14],
              to: [0, 14],
              stops: [
                { offset: 0, color: '#007AFF' },
                { offset: 1, color: '#0056CC' },
              ],
            })
          : new Gradient({
              type: 'linear',
              from: [0, -14],
              to: [0, 14],
              stops: [
                { offset: 0, color: '#4B91F7' },
                { offset: 1, color: '#367AF6' },
              ],
            })
      }
      paddingTop={8}
      paddingBottom={8}
      paddingLeft={24}
      paddingRight={24}
      radius={6}
      shadowBlur={1.5}
      shadowColor={
        lightMode ? 'rgba(0, 122, 255, 0.25)' : 'rgba(54, 122, 246, 0.25)'
      }
      shadowOffset={[0, 0.5]}
    >
      <Txt
        fill={'white'}
        fontFamily={
          'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        }
        fontSize={20}
        fontWeight={600}
      >
        {text}
      </Txt>
    </Rect>
  );
};

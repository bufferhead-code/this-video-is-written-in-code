import {
  Rect,
  Code,
  Layout,
  RectProps,
} from '@motion-canvas/2d/lib/components';
import { Node, NodeProps } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';

export interface CodeCardProps extends RectProps {
  code: string;
  codeRef?: any; // Should be a createRef<Code>
  codeProps?: any;
  preview?: Node | any;
  layoutDirection?: 'row' | 'column';
  children?: Node[];
}

export const CodeCard = ({
  code,
  codeRef,
  codeProps,
  preview,
  layoutDirection = 'row',
  children,
  ...rectProps
}: CodeCardProps) => {
  return (
    <Rect
      radius={18}
      padding={36}
      shadowBlur={24}
      lineWidth={2}
      fill={'#23272e'}
      stroke={'#353b45'}
      shadowColor={'rgba(0, 0, 0, 0.10)'}
      shadowOffsetY={10}
      layout
      direction={layoutDirection}
      alignItems={'center'}
      justifyContent={'center'}
      gap={60}
      {...rectProps}
    >
      <Code
        ref={codeRef}
        code={code}
        fontSize={32}
        fontFamily={'Fira Code, Consolas, monospace'}
        fill={'#d4d4d4'}
        offsetX={-1}
        offsetY={-1}
        {...(codeProps || {})}
      />
      {preview}
      {children}
    </Rect>
  );
};

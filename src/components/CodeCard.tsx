import {
  Rect,
  Code,
  Layout,
  RectProps,
} from '@motion-canvas/2d/lib/components';
import { Node, NodeProps } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';
import { DEFAULT } from '@motion-canvas/core';

export interface CodeCardProps extends RectProps {
  code: string;
  codeRef?: any; // Should be a createRef<Code>
  codeProps?: any;
  preview?: Node | any;
  layoutDirection?: 'row' | 'column';
  alignItems?: 'start' | 'center' | 'end';
  justifyContent?: 'start' | 'center' | 'end';
  fontSize?: number;
  children?: Node[];
}

// Interface for the CodeCard return type with highlight method
export interface CodeCardInstance extends Rect {
  highlight: (text: string, duration?: number) => ThreadGenerator;
  resetHighlight: (duration?: number) => ThreadGenerator;
}

export const CodeCard = ({
  code,
  codeRef,
  codeProps,
  preview,
  layoutDirection = 'row',
  alignItems = 'start',
  justifyContent = 'start',
  fontSize = 32,
  children,
  ...rectProps
}: CodeCardProps): CodeCardInstance => {
  // Create a ref for the Code component if not provided
  const internalCodeRef = createRef<Code>();
  const finalCodeRef = codeRef || internalCodeRef;

  // Highlight function that can be called on the CodeCard instance
  const highlight = function* (text: string, duration: number = 0.5): ThreadGenerator {
    const range = finalCodeRef().findFirstRange(text);
    if (range) {
      yield* finalCodeRef().selection(range, duration);
    }
  };

  // Reset highlight function that clears any current selection
  const resetHighlight = function* (duration: number = 0.5): ThreadGenerator {
    yield* finalCodeRef().selection(DEFAULT, duration);
  };

  // Create the CodeCard instance
  const codeCard = (
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
      alignItems={alignItems}
      justifyContent={justifyContent}
      gap={60}
      {...rectProps}
    >
      <Code
        ref={finalCodeRef}
        code={code}
        fontSize={fontSize}
        fontFamily={'Fira Code, Consolas, monospace'}
        fill={'#d4d4d4'}
        offsetX={-1}
        offsetY={-1}
        {...(codeProps || {})}
      />
      {preview}
      {children}
    </Rect>
  ) as CodeCardInstance;

  // Attach the highlight and resetHighlight methods to the CodeCard instance
  codeCard.highlight = highlight;
  codeCard.resetHighlight = resetHighlight;

  return codeCard;
};

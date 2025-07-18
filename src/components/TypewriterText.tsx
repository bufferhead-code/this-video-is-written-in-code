import { Txt, TxtProps } from '@motion-canvas/2d/lib/components';

export interface TypewriterTextProps extends TxtProps {
  fullText: string;
}

export class TypewriterText extends Txt {
  public constructor(props: TypewriterTextProps) {
    super(props);
  }
}
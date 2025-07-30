import { MacWindow, MacWindowProps } from './MacWindow';
import { Terminal, TerminalProps } from './Terminal';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';

export interface MacTerminalWindowProps extends MacWindowProps, Omit<TerminalProps, 'children'> {
  title?: SignalValue<string>;
  lightMode?: SignalValue<boolean>;
  showTitle?: SignalValue<boolean>;
  terminalFontSize?: SignalValue<number>;
  terminalFontFamily?: SignalValue<string>;
  prompt?: SignalValue<string>;
}

export class MacTerminalWindow extends MacWindow {
  public terminal: Terminal;

  public constructor(props?: MacTerminalWindowProps) {
    const {
      terminalFontSize,
      terminalFontFamily,
      prompt,
      children, // ignore children, we set Terminal as content
      ...windowProps
    } = props || {};

    super({
      ...windowProps,
    });

    this.terminal = new Terminal({
      width: this.width(),
      height: this.height() - this.titleBarHeight(),
      terminalFontSize,
      terminalFontFamily,
      prompt,
    });

    this.getContentArea().add(this.terminal);
  }

  public getTerminal(): Terminal {
    return this.terminal;
  }
} 
import { Rect, Txt, RectProps, Node } from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { waitFor } from '@motion-canvas/core';

export interface TerminalProps extends RectProps {
  prompt?: SignalValue<string>;
  terminalFontFamily?: SignalValue<string>;
  terminalFontSize?: SignalValue<number>;
}

export class Terminal extends Rect {
  @initial('$ ')
  @signal()
  declare public readonly prompt: SimpleSignal<string>;

  @initial('Monaco, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace')
  @signal()
  declare public readonly terminalFontFamily: SimpleSignal<string>;

  @initial(16)
  @signal()
  declare public readonly terminalFontSize: SimpleSignal<number>;

  private content: Rect;
  private promptText: Txt;
  private commandText: Txt;
  private currentLine: number = 0;

  public constructor(props?: TerminalProps) {
    super({
      fill: '#1e1e1e',
      radius: 8,
      layout: true,
      direction: 'column',
      alignItems: 'start',
      justifyContent: 'start',
      padding: 20,
      ...props,
    });

    this.setupTerminal();
  }

  private setupTerminal() {
    this.content = new Rect({
      layout: true,
      direction: 'column',
      alignItems: 'start',
      justifyContent: 'start',
      gap: 8,
      width: '100%',
    });
    this.add(this.content);

    // Initial prompt line
    this.addPromptLine();
  }

  private addPromptLine() {
    const promptLine = new Rect({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      width: '100%',
    });

    this.promptText = new Txt({
      text: this.prompt,
      fill: '#4CAF50',
      fontFamily: this.terminalFontFamily,
      fontSize: this.terminalFontSize,
      fontWeight: 700,
      marginRight: 12,
    });

    this.commandText = new Txt({
      text: '',
      fill: '#ffffff',
      fontFamily: this.terminalFontFamily,
      fontSize: this.terminalFontSize,
    });

    promptLine.add(this.promptText);
    promptLine.add(this.commandText);
    this.content.add(promptLine);
  }

  // Typewriter effect for typing commands
  public *typeCommand(
    command: string,
    duration: number = 1,
    delay: number = 0,
  ) {
    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Clear current command
    this.commandText.text('');

    // Calculate time per character
    const timePerChar = duration / command.length;

    // Animate each character with syntax highlighting
    for (let i = 0; i <= command.length; i++) {
      const currentText = command.substring(0, i);
      const displayText = currentText + (i < command.length ? '|' : '');
      
      // Apply syntax highlighting
      this.commandText.text(this.highlightSyntax(displayText));

      // Wait before showing next character
      if (i < command.length) {
        yield* waitFor(timePerChar);
      }
    }

    // Remove cursor at the end
    this.commandText.text(this.highlightSyntax(command));

    return this;
  }

  // Enhanced typewriter with blinking cursor
  public *typeCommandWithCursor(
    command: string,
    duration: number = 1,
    delay: number = 0,
    blinkCount: number = 3,
  ) {
    // Wait for initial delay if specified
    if (delay > 0) {
      yield* waitFor(delay);
    }

    // Clear current command
    this.commandText.text('');

    // Calculate time per character
    const timePerChar = duration / command.length;

    // Animate each character
    for (let i = 0; i <= command.length; i++) {
      const currentText = command.substring(0, i);
      const displayText = currentText + '|';
      
      this.commandText.text(this.highlightSyntax(displayText));

      // Wait before showing next character
      if (i < command.length) {
        yield* waitFor(timePerChar);
      }
    }

    // Blink cursor at the end
    yield* this.blinkCursor(command, blinkCount);

    // Remove cursor
    this.commandText.text(this.highlightSyntax(command));

    return this;
  }

  // Add a new line with output
  public addOutput(output: string, color: string = '#ffffff') {
    const outputText = new Txt({
      text: output,
      fill: color,
      fontFamily: this.terminalFontFamily,
      fontSize: this.terminalFontSize,
      textWrap: 'pre',
      width: '100%',
    });

    this.content.add(outputText);
    this.currentLine++;
  }

  // Add a new prompt line for the next command
  public addNewPromptLine() {
    this.addPromptLine();
    this.currentLine++;
  }

  // Simple syntax highlighting for common terminal commands
  private highlightSyntax(text: string): string {
    // For now, just return the text as-is since Motion Canvas Txt doesn't support HTML
    // TODO: Could be enhanced with multiple Txt components for different colors
    return text;
  }

  // Helper method for cursor blinking
  private *blinkCursor(baseText: string, blinkCount: number = 3) {
    const blinkDuration = 0.3;

    for (let i = 0; i < blinkCount; i++) {
      // Show cursor
      this.commandText.text(this.highlightSyntax(baseText + '|'));
      yield* waitFor(blinkDuration);

      // Hide cursor
      this.commandText.text(this.highlightSyntax(baseText));
      yield* waitFor(blinkDuration);
    }
  }

  // Clear the terminal
  public clear() {
    this.content.removeChildren();
    this.currentLine = 0;
    this.addPromptLine();
  }

  // Get the content area for manual manipulation
  public getContent(): Rect {
    return this.content;
  }
}
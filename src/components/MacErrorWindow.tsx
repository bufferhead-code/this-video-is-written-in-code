import { Layout, RectProps, Img, Txt } from '@motion-canvas/2d/lib/components';
import { MacWindow, MacWindowProps } from './MacWindow';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import macError from './media/mac_error_icon.png';

export interface MacErrorWindowProps extends MacWindowProps {
  title?: SignalValue<string>;
  message?: SignalValue<string>;
  lightMode?: SignalValue<boolean>;
}

export class MacErrorWindow extends MacWindow {
  @initial('')
  @signal()
  declare public readonly message: SimpleSignal<string>;

  public constructor(props?: MacErrorWindowProps) {
    const { message, ...windowProps } = props || {};

    super({
      width: 540,
      height: 280,
      showTitle: true,
      ...windowProps,
    });

    // Set the message signal
    if (message !== undefined) {
      this.message(message);
    }

    this.setupErrorContent();
  }

  private setupErrorContent() {
    // Define color scheme for message text
    const messageTextColor = () =>
      this.lightMode() ? 'rgba(28, 28, 30, 0.85)' : 'rgba(235, 235, 245, 0.85)';

    // Create the error content
    const contentContainer = new Layout({
      layout: true,
      direction: 'column',
      gap: 20,
      padding: [0, 40],
      alignItems: 'center',
      justifyContent: 'center',
      grow: 1,
    });

    const mainContent = new Layout({
      layout: true,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    });

    const errorIcon = new Img({
      src: macError,
      width: 100,
      height: 100,
    });

    const textContainer = new Layout({
      layout: true,
      width: '100%',
      direction: 'column',
      gap: 20,
      grow: 1,
    });

    const messageTextContainer = new Layout({
      layout: true,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    });

    const messageText = new Txt({
      fill: messageTextColor,
      fontFamily:
        'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 32,
      fontWeight: 500,
      textWrap: true,
      lineHeight: 40,
      text: this.message,
    });

    const bottomSpacer = new Layout({
      layout: true,
      width: '100%',
      justifyContent: 'end',
      alignItems: 'end',
    });

    // Assemble the layout
    messageTextContainer.add(messageText);
    textContainer.add(messageTextContainer);
    textContainer.add(bottomSpacer);
    mainContent.add(errorIcon);
    mainContent.add(textContainer);
    contentContainer.add(mainContent);

    // Add content to the window
    this.getContentArea().add(contentContainer);
  }
}

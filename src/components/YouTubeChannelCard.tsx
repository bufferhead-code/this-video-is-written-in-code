import { Layout, Rect, Txt, Img, NodeProps } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { Color, Vector2, PossibleColor } from '@motion-canvas/core';

export interface YoutubeChannelCardProps extends NodeProps {
  channelName?: SignalValue<string>;
  username?: SignalValue<string>;
  subscribers?: SignalValue<string>;
  videos?: SignalValue<string>;
  description?: SignalValue<string>;
  avatarSrc?: SignalValue<string>;
  cardWidth?: SignalValue<number>;
  cardHeight?: SignalValue<number>;
}

export class YoutubeChannelCard extends Layout {
  @initial('Bufferhead')
  @signal()
  declare public readonly channelName: SimpleSignal<string>;

  @initial('@bufferhead_')
  @signal()
  declare public readonly username: SimpleSignal<string>;

  @initial('7.64K subscribers')
  @signal()
  declare public readonly subscribers: SimpleSignal<string>;

  @initial('28 videos')
  @signal()
  declare public readonly videos: SimpleSignal<string>;

  @initial(
    'expert in breaking ci pipelines. i do silly web projects sometimes. building ...more',
  )
  @signal()
  declare public readonly description: SimpleSignal<string>;

  @initial('')
  @signal()
  declare public readonly avatarSrc: SimpleSignal<string>;

  @initial(1300)
  @signal()
  declare public readonly cardWidth: SimpleSignal<number>;

  @initial(420)
  @signal()
  declare public readonly cardHeight: SimpleSignal<number>;

  private cardBackground: Rect;
  private avatar: Rect;
  private avatarImage: Img;
  private nameText: Txt;
  private usernameText: Txt;
  private descriptionText: Txt;
  private subscribeButton: Rect;
  private subscribeButtonText: Txt;

  public constructor(props?: YoutubeChannelCardProps) {
    super({
      layout: false,
      width: () => this.cardWidth(),
      height: () => this.cardHeight(),
      ...props,
    });

    this.setupCard();
  }

  private setupCard() {
    // Card background
    this.cardBackground = new Rect({
      width: () => this.cardWidth(),
      height: () => this.cardHeight(),
      fill: '#ffffff',
      radius: 40,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      padding: 50,
      layout: true,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 60,
    });

    // Avatar container - circular clipping mask
    this.avatar = new Rect({
      size: 300,
      radius: 300,
      fill: '#6b46c1', // Purple background fallback
      x: -320,
      y: -20,
      clip: true, // This will clip the image to the circle
    });

    // Avatar image - only show if avatarSrc is provided
    this.avatarImage = new Img({
      src: this.avatarSrc,
      size: 300,
      x: 0, // Center the image
      y: 0, // Center the image
      opacity: () => (this.avatarSrc() ? 1 : 0),
      fill: 'white',
    });

    // Add the image to the avatar container for clipping
    this.avatar.add(this.avatarImage);

    // Channel name - large and bold
    this.nameText = new Txt({
      text: this.channelName,
      fontSize: 48,
      fontWeight: 700,
      fill: '#0f0f0f',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'left',
      textWrap: true,
    });

    // Username and stats on same line
    this.usernameText = new Txt({
      text: () =>
        `${this.username()} • ${this.subscribers()} • ${this.videos()}`,
      fontSize: 26,
      fill: '#606060',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      textAlign: 'left',
    });

    // Description
    this.descriptionText = new Txt({
      text: this.description().split(' ').slice(0, 17).join(' ') + '...',
      fontSize: 26,
      fill: '#555555',
      maxWidth: '90%',
      fontWeight: 400,
      textWrap: true,
      paddingBottom: 15,
      lineHeight: 29,
      fontFamily: 'Inter, sans-serif',
      textAlign: 'left',
    });

    // Subscribe button
    this.subscribeButton = new Rect({
      width: 250,
      height: 80,
      fill: '#FF0000', // youtube red
      radius: 50,
      layout: true,
      justifyContent: 'center',
      alignItems: 'center',
    });

    this.subscribeButtonText = new Txt({
      text: 'Subscribe',
      fontSize: 28,
      fontWeight: 500,
      textAlign: 'center',
      fill: '#ffffff',
      fontFamily: 'Inter, sans-serif',
    });

    this.subscribeButton.add(this.subscribeButtonText);

    const contentContainer = new Layout({
      layout: true,
      direction: 'column',
      justifyContent: 'center',

      gap: 25,
    });

    // Add all elements to the card
    this.cardBackground.add(this.avatar);
    this.cardBackground.add(contentContainer);
    contentContainer.add(this.nameText);
    contentContainer.add(this.usernameText);
    contentContainer.add(this.descriptionText);
    contentContainer.add(this.subscribeButton);

    this.add(this.cardBackground);
  }

  public *animateIn(duration: number = 1) {
    yield* this.opacity(1, duration);
    yield* this.scale(1, duration);
  }

  public *animateOut(duration: number = 0.5) {
    yield* this.opacity(0, duration);
    yield* this.scale(0, duration);
  }
}

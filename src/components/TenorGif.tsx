import { Img, Rect, Node, NodeProps, Video } from '@motion-canvas/2d';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';

// Import the local video file
import oprahPointingVideo from './media/tenor/oprah-pointing.mp4';

export interface TenorGifProps extends NodeProps {
  tenorUrl?: SignalValue<string>;
  tenorId?: SignalValue<string>;
  width?: SignalValue<number>;
  height?: SignalValue<number>;
  radius?: SignalValue<number>;
  shadowOffsetX?: SignalValue<number>;
  shadowOffsetY?: SignalValue<number>;
}

export class TenorGif extends Node {
  @initial('')
  @signal()
  declare public readonly tenorUrl: SimpleSignal<string>;

  @initial('')
  @signal()
  declare public readonly tenorId: SimpleSignal<string>;

  @initial(400)
  @signal()
  declare public readonly width: SimpleSignal<number>;

  @initial(300)
  @signal()
  declare public readonly height: SimpleSignal<number>;

  @initial(12)
  @signal()
  declare public readonly radius: SimpleSignal<number>;

  // Shadow properties are inherited from Node, no need to redeclare

  @initial(0)
  @signal()
  declare public readonly shadowOffsetX: SimpleSignal<number>;

  @initial(5)
  @signal()
  declare public readonly shadowOffsetY: SimpleSignal<number>;

  private container: Rect;
  private gifImg: Img;

  public constructor(props?: TenorGifProps) {
    super(props);
    this.setupGifComponent();
  }

  private extractTenorId(url: string): string {
    // Extract ID from Tenor URL
    // URL format: https://tenor.com/de-AT/view/oprah-winfrey-point-out-pointing-gif-361299607546324637
    const match = url.match(/gif-(\d+)$/);
    return match ? match[1] : url;
  }

  private getTenorGifUrl(id: string): string {
    // Check if we have a local version first
    if (id === '361299607546324637') {
      // Use local MP4 file for the Oprah pointing GIF
      return oprahPointingVideo;
    }
    // Convert Tenor ID to direct GIF URL
    // Tenor API format for direct GIF access
    return `https://media.tenor.com/images/${id}/tenor.gif`;
  }

  private setupGifComponent() {
    // Determine the GIF source
    let gifSrc = '';
    if (this.tenorUrl()) {
      const extractedId = this.extractTenorId(this.tenorUrl());
      gifSrc = this.getTenorGifUrl(extractedId);
    } else if (this.tenorId()) {
      gifSrc = this.getTenorGifUrl(this.tenorId());
    }

    // Create container with rounded corners and shadow
    this.container = new Rect({
      width: this.width(),
      height: this.height(),
      radius: this.radius(),
      clip: true,
      shadowColor: this.shadowColor(),
      shadowBlur: this.shadowBlur(),
      shadowOffsetX: this.shadowOffsetX(),
      shadowOffsetY: this.shadowOffsetY(),
    });

    // Determine if this is a video file (MP4) or image (GIF)
    const isVideo = gifSrc.endsWith('.mp4') || gifSrc === oprahPointingVideo;

    if (isVideo) {
      // Create the video component for MP4 files
      const videoComponent = new Video({
        src: gifSrc,
        width: this.width(),
        height: this.height(),
        play: true,
        loop: true,
      });
      this.container.add(videoComponent);
      this.gifImg = videoComponent as any; // Type assertion for compatibility
    } else {
      // Create the GIF image for regular GIF files
      this.gifImg = new Img({
        src: gifSrc,
        width: this.width(),
        height: this.height(),
      });
      this.container.add(this.gifImg);
    }

    // Add container to this node
    this.add(this.container);
  }

  public updateGif(tenorUrl?: string, tenorId?: string) {
    let gifSrc = '';

    if (tenorUrl) {
      this.tenorUrl(tenorUrl);
      const extractedId = this.extractTenorId(tenorUrl);
      gifSrc = this.getTenorGifUrl(extractedId);
    } else if (tenorId) {
      this.tenorId(tenorId);
      gifSrc = this.getTenorGifUrl(tenorId);
    }

    if (gifSrc) {
      this.gifImg.src(gifSrc);
    }
  }

  public *animateIn(duration: number = 1) {
    // Start invisible and scale down
    this.container.opacity(0);
    this.container.scale(0.8);

    // Animate in with fade and scale
    yield* this.container.opacity(1, duration);
    yield* this.container.scale(1, duration);
  }

  public *animateOut(duration: number = 0.5) {
    // Animate out with fade and scale
    yield* this.container.opacity(0, duration);
    yield* this.container.scale(0.8, duration);
  }
}

// Function component version for simpler usage
export const TenorGifComponent = (props: TenorGifProps) => {
  const {
    tenorUrl = '',
    tenorId = '',
    width = 400,
    height = 300,
    radius = 12,
    shadowColor = 'rgba(0, 0, 0, 0.2)',
    shadowBlur = 10,
    shadowOffsetX = 0,
    shadowOffsetY = 5,
    ...otherProps
  } = props;

  // Extract ID from URL if provided
  const extractTenorId = (url: string): string => {
    const match = url.match(/gif-(\d+)$/);
    return match ? match[1] : url;
  };

  // Get direct GIF URL
  const getTenorGifUrl = (id: string): string => {
    // Check if we have a local version first
    if (id === '361299607546324637') {
      // Use local MP4 file for the Oprah pointing GIF
      return oprahPointingVideo;
    }
    return `https://media.tenor.com/images/${id}/tenor.gif`;
  };

  // Determine the GIF source
  let gifSrc = '';
  if (tenorUrl) {
    const extractedId = extractTenorId(tenorUrl as string);
    gifSrc = getTenorGifUrl(extractedId);
  } else if (tenorId) {
    gifSrc = getTenorGifUrl(tenorId as string);
  }

  // Determine if this is a video file (MP4) or image (GIF)
  const isVideo = gifSrc.endsWith('.mp4') || gifSrc === oprahPointingVideo;

  return (
    <Rect
      {...otherProps}
      width={width}
      height={height}
      radius={radius}
      clip={true}
      shadowColor={shadowColor}
      shadowBlur={shadowBlur}
      shadowOffsetX={shadowOffsetX}
      shadowOffsetY={shadowOffsetY}
    >
      {isVideo ? (
        <Video src={gifSrc} width={width} height={height} play loop />
      ) : (
        <Img src={gifSrc} width={width} height={height} />
      )}
    </Rect>
  );
};

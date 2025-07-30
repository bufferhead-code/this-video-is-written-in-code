import { Node, Img, Rect, signal, Layout } from '@motion-canvas/2d';
import { SimpleSignal, createRef, createComputed } from '@motion-canvas/core';
import sillyEmojiBaseSvg from './media/silly-emoji-base.svg';

export interface SillyEmojiProps {
  silliness?: number;
  scale?: number;
}

export class SillyEmoji extends Node {
  @signal()
  public declare readonly silliness: SimpleSignal<number, this>;

  private containerRef = createRef<Layout>();
  private emojiRef = createRef<Img>();
  private tongueRef = createRef<Rect>();

  public constructor(props: SillyEmojiProps = {}) {
    super({
      silliness: 0,
      ...props,
    });
    
        // Create a container with layout disabled for precise positioning
    const container = new Layout({
      ref: this.containerRef,
      layout: false,
      width: 200,
      height: 200,
    });
    
    // Create the base emoji image
    const emojiImage = new Img({
      ref: this.emojiRef,
      src: sillyEmojiBaseSvg,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
    });
    
    // Create the tongue as a rounded rectangle
    const tongueElement = new Rect({
      ref: this.tongueRef,
      width: 50,
      height: () => 20 + (this.silliness() / 100) * 60, // Height varies from 20 to 80 based on silliness
      x: 10,
      y: () => 50 + (this.silliness() / 100) * 30, // Move up as height increases to keep top fixed
      zIndex: 1,
      fill: '#ff52a0', // Same color as the original tongue
      radius: [5, 5, 15, 15,], // Rounded bottom corners
    });
    
    container.add(emojiImage);
    container.add(tongueElement);
    this.add(container);
    
    // Create a computed signal that updates the tongue when silliness changes
    createComputed(() => {
      return this.silliness();
    });
  }

}
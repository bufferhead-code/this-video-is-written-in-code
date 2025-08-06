import { Rect, Txt, Node } from '@motion-canvas/2d/lib/components';
import { createSignal } from '@motion-canvas/core';

export interface ElementCardProps {
  elementName: string;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
}

export class ElementCard extends Node {
  private cardRect: Rect;
  private elementText: Txt;

  constructor(props: ElementCardProps) {
    super({
      x: props.x ?? 0,
      y: props.y ?? 0,
      scale: props.scale ?? 1,
      opacity: props.opacity ?? 1,
    });

    // Create the dark card background
    this.cardRect = new Rect({
      width: 350,
      height: 180,
      radius: 12,
      fill: '#2d2d2f',
      stroke: '#333',
      lineWidth: 2,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: [0, 4],
      shadowBlur: 12,
      layout: true,
      direction: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    });

    // Create the element text with monospace font
    this.elementText = new Txt({
      text: `<${props.elementName}>`,
      fontSize: 32,
      fontFamily: 'Monaco, "Courier New", monospace',
      fontWeight: 700,
      fill: '#FFFFFF',
      y: 0,
    });

    // Add components to the card
    this.cardRect.add(this.elementText);
    this.add(this.cardRect);
  }

  public getCard(): Rect {
    return this.cardRect;
  }

  public getText(): Txt {
    return this.elementText;
  }
}
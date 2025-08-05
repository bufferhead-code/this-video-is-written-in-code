import {
  Layout,
  LayoutProps,
  Node,
  Rect,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { all, waitFor } from '@motion-canvas/core';
import { easeOutCubic, easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { createRef, Reference } from '@motion-canvas/core/lib/utils';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';

export interface DynamicColumnLayoutProps extends LayoutProps {
  itemGap?: SignalValue<number>;
  animationDuration?: SignalValue<number>;
}

export interface ColumnItem {
  node: Rect;
  ref: Reference<Rect>;
  targetWidth: number;
  index: number;
}

export class DynamicColumnLayout extends Layout {
  @initial(20)
  @signal()
  declare public readonly itemGap: SimpleSignal<number>;

  @initial(0.5)
  @signal()
  declare public readonly animationDuration: SimpleSignal<number>;

  private items: ColumnItem[] = [];
  private isAnimating = false;

  public constructor(props?: DynamicColumnLayoutProps) {
    super({
      layout: true,
      direction: 'row',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: props?.itemGap || 20,
      ...props,
    });
  }

  public *addItem(node: Rect, targetWidth: number = 100): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.1);
      return yield* this.addItem(node, targetWidth);
    }

    this.isAnimating = true;
    const ref = createRef<Rect>();
    const newItem: ColumnItem = {
      node,
      ref,
      targetWidth,
      index: this.items.length,
    };

    if (this.items.length === 0) {
      // First item - no gap animation needed, but still fade in
      node.opacity(0);
      this.addToLayout(newItem);
      yield* all(
        node.width(targetWidth, this.animationDuration(), easeOutCubic),
        node.opacity(1, this.animationDuration(), easeOutCubic),
      );
      this.isAnimating = false;
      return;
    }

    // Step 1: Add right margin to last element and prepare new element
    const lastItem = this.items[this.items.length - 1];
    const gapValue = this.itemGap();

    node.width(0);
    node.opacity(0);

    // Step 2: Animate everything together for smooth movement
    this.addToLayout(newItem);
    lastItem.node.margin.right(
      gapValue,
      this.animationDuration(),
      easeOutCubic,
    );

    // Step 3: Animate the new element appearing while the first element settles
    yield* node.width(targetWidth, this.animationDuration(), easeOutCubic);
    yield* node.opacity(1, this.animationDuration(), easeOutCubic);

    this.isAnimating = false;
  }

  public *insertItem(
    node: Rect,
    index: number,
    targetWidth: number = 100,
  ): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.1);
      return yield* this.insertItem(node, index, targetWidth);
    }

    if (index >= this.items.length) {
      return yield* this.addItem(node, targetWidth);
    }

    if (index === 0) {
      return yield* this.insertAtBeginning(node, targetWidth);
    }

    this.isAnimating = true;
    const ref = createRef<Rect>();
    const newItem: ColumnItem = {
      node,
      ref,
      targetWidth,
      index,
    };

    const gapValue = this.itemGap();
    const beforeItem = this.items[index - 1];
    const afterItem = this.items[index];

    // Step 1: Add right margin to element before insertion point
    // and left margin to element after insertion point
    yield* all(
      beforeItem.node.margin.right(
        gapValue / 2,
        this.animationDuration(),
        easeOutCubic,
      ),
      afterItem.node.margin.left(
        gapValue / 2,
        this.animationDuration(),
        easeOutCubic,
      ),
    );

    // Step 2: Add element with 0 width and 0 opacity, remove margins
    node.width(0);
    node.opacity(0);
    this.insertToLayout(newItem, index);

    yield* all(
      beforeItem.node.margin.right(
        0,
        this.animationDuration() * 0.5,
        easeInOutCubic,
      ),
      afterItem.node.margin.left(
        0,
        this.animationDuration() * 0.5,
        easeInOutCubic,
      ),
    );

    // Step 3: Animate width to desired width
    yield* node.width(targetWidth, this.animationDuration(), easeOutCubic);

    // Step 4: Fade in
    yield* node.opacity(1, this.animationDuration() * 0.6, easeOutCubic);

    this.isAnimating = false;
  }

  private *insertAtBeginning(node: Rect, targetWidth: number): ThreadGenerator {
    const ref = createRef<Rect>();
    const newItem: ColumnItem = {
      node,
      ref,
      targetWidth,
      index: 0,
    };

    if (this.items.length === 0) {
      node.opacity(0);
      this.addToLayout(newItem);
      yield* all(
        node.width(targetWidth, this.animationDuration(), easeOutCubic),
        node.opacity(1, this.animationDuration() * 0.6, easeOutCubic),
      );
      return;
    }

    const gapValue = this.itemGap();
    const nextItem = this.items[0];

    // Step 1: Prepare new element and add to layout
    node.width(0);
    node.opacity(0);

    // Step 2: Animate the existing element moving right
    yield* all(
      nextItem.node.margin.left(
        gapValue,
        this.animationDuration() * 0.3,
        easeOutCubic,
      ),
    );

    // Step 3: Animate the existing element moving right
    yield* nextItem.node.margin.left(0, 0);

    this.insertToLayout(newItem, 0);

    // Step 3: Animate the new element appearing
    yield* node.width(targetWidth, this.animationDuration(), easeOutCubic);

    yield* node.opacity(1, this.animationDuration() * 0.6, easeOutCubic);
  }

  public *removeByRef(nodeToRemove: Reference<Rect>): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.5);
      return yield* this.removeByRef(nodeToRemove);
    }

    const itemIndex = this.items.findIndex((item) => item.ref === nodeToRemove);
    if (itemIndex === -1) return;

    yield* this.removeByIndex(itemIndex);
  }

  public *removeByIndex(index: number): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.5);
      return yield* this.removeByIndex(index);
    }

    if (index < 0 || index >= this.items.length) return;

    this.isAnimating = true;
    const item = this.items[index];
    const node = item.node;

    // Prepare gap animations for adjacent items
    const gapAnimations: ThreadGenerator[] = [];
    const gapValue = this.itemGap();

    if (this.items.length > 1) {
      if (index === 0 && this.items.length > 1) {
        // Removing first item - animate left margin of second item
        const nextItem = this.items[1];
        gapAnimations.push(
          nextItem.node.margin.left(
            gapValue,
            this.animationDuration(),
            easeOutCubic,
          ),
        );
      } else if (index === this.items.length - 1) {
        // Removing last item - animate right margin of previous item
        const prevItem = this.items[index - 1];
        gapAnimations.push(
          prevItem.node.margin.right(
            gapValue,
            this.animationDuration(),
            easeOutCubic,
          ),
        );
      } else {
        // Removing middle item - animate margins of adjacent items
        const prevItem = this.items[index - 1];
        const nextItem = this.items[index + 1];
        gapAnimations.push(
          prevItem.node.margin.right(
            gapValue / 2,
            this.animationDuration(),
            easeOutCubic,
          ),
          nextItem.node.margin.left(
            gapValue / 2,
            this.animationDuration(),
            easeOutCubic,
          ),
        );
      }
    }

    // Animate everything simultaneously: fade out, shrink width, and adjust gaps
    yield* all(
      node.opacity(0, this.animationDuration() * 0.6, easeInOutCubic),
      node.width(0, this.animationDuration(), easeInOutCubic),
      ...gapAnimations,
    );

    // Remove from layout and items array
    this.removeItem(index);
    this.isAnimating = false;
  }

  public *replaceAtIndex(
    newNode: Rect,
    index: number,
    targetWidth: number = 100,
  ): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.1);
      return yield* this.replaceAtIndex(newNode, index, targetWidth);
    }

    if (index < 0 || index >= this.items.length) return;

    this.isAnimating = true;
    const oldItem = this.items[index];
    const oldNode = oldItem.node;
    const oldWidth = oldNode.width();

    // Step 1: Fade out the old node
    yield* oldNode.opacity(0, this.animationDuration() * 0.4, easeInOutCubic);

    // Step 2: Remove old node and add new node
    const ref = createRef<Rect>();
    const newItem: ColumnItem = {
      node: newNode,
      ref,
      targetWidth,
      index,
    };

    // Replace in the items array and layout
    this.items[index] = newItem;
    oldNode.remove();
    this.add(newNode);

    // Step 3: Prepare new node with old width and 0 opacity
    newNode.width(oldWidth);
    newNode.opacity(0);

    // Step 4: Animate width from old width to new width and fade in
    yield* newNode.width(targetWidth, this.animationDuration(), easeOutCubic);
    yield* newNode.opacity(1, this.animationDuration() * 0.6, easeOutCubic);

    this.isAnimating = false;
  }

  private addToLayout(item: ColumnItem) {
    this.items.push(item);
    this.add(item.node);
    this.updateIndices();
  }

  private insertToLayout(item: ColumnItem, index: number) {
    this.items.splice(index, 0, item);

    // Insert at the correct position in the layout
    if (index === 0) {
      this.insert(item.node, 0);
    } else {
      const prevItem = this.items[index - 1];
      this.insert(item.node, this.children().indexOf(prevItem.node) + 1);
    }

    this.updateIndices();
  }

  private removeItem(index: number) {
    const item = this.items[index];
    item.node.remove();
    this.items.splice(index, 1);
    this.updateIndices();
  }

  private updateIndices() {
    this.items.forEach((item, index) => {
      item.index = index;
    });
  }

  public getItems(): ColumnItem[] {
    return [...this.items];
  }

  public getItemCount(): number {
    return this.items.length;
  }

  public *clear(): ThreadGenerator {
    if (this.isAnimating) {
      yield* waitFor(0.1);
      return yield* this.clear();
    }

    this.isAnimating = true;

    // Fade out all items simultaneously
    yield* all(
      ...this.items.map((item) =>
        item.node.opacity(0, this.animationDuration() * 0.4, easeInOutCubic),
      ),
    );

    // Animate all widths to 0
    yield* all(
      ...this.items.map((item) =>
        item.node.width(0, this.animationDuration() * 0.6, easeInOutCubic),
      ),
    );

    // Clear all items
    this.items.forEach((item) => item.node.remove());
    this.items = [];

    this.isAnimating = false;
  }
}

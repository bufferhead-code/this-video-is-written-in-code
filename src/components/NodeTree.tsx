import {
  Layout,
  LayoutProps,
  Rect,
  Txt,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import { all, waitFor } from '@motion-canvas/core';

export interface NodeTreeItem {
  name: string;
  type: 'element' | 'text';
  children?: NodeTreeItem[];
  expanded?: boolean;
}

export interface NodeTreeProps extends LayoutProps {
  structure?: SignalValue<NodeTreeItem[]>;
  elementColor?: SignalValue<PossibleColor>;
  textColor?: SignalValue<PossibleColor>;
  labelColor?: SignalValue<PossibleColor>;
  indentAmount?: SignalValue<number>;
  rowSize?: SignalValue<number>;
  textSize?: SignalValue<number>;
}

interface NodeTreeRow {
  item: NodeTreeItem;
  layout: Layout;
  label: Txt;
  background: Rect;
  level: number;
}

export class NodeTree extends Layout {
  @initial([])
  @signal()
  declare public readonly structure: SimpleSignal<NodeTreeItem[]>;

  @initial('#3498db')
  @signal()
  declare public readonly elementColor: SimpleSignal<PossibleColor>;

  @initial('#95a5a6')
  @signal()
  declare public readonly textColor: SimpleSignal<PossibleColor>;

  @initial('#ffffff')
  @signal()
  declare public readonly labelColor: SimpleSignal<PossibleColor>;

  @initial(20)
  @signal()
  declare public readonly indentAmount: SimpleSignal<number>;

  @initial(24)
  @signal()
  declare public readonly rowSize: SimpleSignal<number>;

  @initial(14)
  @signal()
  declare public readonly textSize: SimpleSignal<number>;

  private rows: Map<string, NodeTreeRow> = new Map();

  public constructor(props?: NodeTreeProps) {
    super({
      layout: true,
      direction: 'column',
      alignItems: 'start',
      gap: 2,
      ...props,
    });

    this.buildTree();
  }

  private buildTree() {
    this.removeChildren();
    this.rows.clear();
    
    const items = this.structure();
    if (items && items.length > 0) {
      this.renderItems(items, 0);
    }
  }

  private renderItems(items: NodeTreeItem[], level: number) {
    for (const item of items) {
      this.renderItem(item, level);
      
      if (item.children && item.expanded !== false) {
        this.renderItems(item.children, level + 1);
      }
    }
  }

  private renderItem(item: NodeTreeItem, level: number) {
    const rowLayout = new Layout({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      width: '100%',
      height: this.rowSize,
      paddingLeft: level * this.indentAmount(),
      opacity: 0, // Start hidden for fade-in animation
    });

    // Background for highlighting
    const background = new Rect({
      layout: false,
      width: '100%',
      height: this.rowSize,
      fill: '#ffffff',
      radius: 4,
      opacity: 0,
    });
    rowLayout.add(background);

    // Create symbol prefix (gray) and text content (white) separately
    if (level > 0) {
      // Gray symbol prefix
      const symbolText = new Txt({
        text: '└─ ',
        fontSize: this.textSize,
        fill: '#95a5a6',
        fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
        marginRight: 8,
      });
      rowLayout.add(symbolText);
    }

    // White text content
    const textContent = level === 0 ? 
      `<${item.name}>` : 
      item.type === 'element' ? 
        `<${item.name}>` : 
        item.name;

    const label = new Txt({
      text: textContent,
      fontSize: this.textSize,
      fill: '#ffffff',
      fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
    });
    rowLayout.add(label);

    this.add(rowLayout);

    // Store reference for later manipulation
    const key = `${level}-${item.name}`;
    this.rows.set(key, {
      item,
      layout: rowLayout,
      label,
      background,
      level,
    });
  }

  private getTextColor(item: NodeTreeItem): PossibleColor {
    if (!item || !item.type) {
      return this.labelColor();
    }
    
    switch (item.type) {
      case 'element':
        return this.elementColor();
      case 'text':
        return this.textColor();
      default:
        return this.labelColor();
    }
  }

  // Animation methods
  public *emphasize(itemPath: string, duration: number = 0.3) {
    const row = this.rows.get(itemPath);
    if (!row) return;

    yield* all(
      row.background.opacity(0.2, duration),
      row.background.fill('#3498db', duration),
      row.label.fill('#ffffff', duration),
    );
  }

  public *reset(itemPath: string, duration: number = 0.3) {
    const row = this.rows.get(itemPath);
    if (!row) return;

    yield* all(
      row.background.opacity(0, duration),
      row.background.fill('#ffffff', duration),
      row.label.fill(this.getTextColor(row.item), duration),
    );
  }

  public *resetAll(duration: number = 0.3) {
    const animations = Array.from(this.rows.keys()).map(key => 
      this.reset(key, duration)
    );
    yield* all(...animations);
  }

  // Update the tree structure
  public updateStructure(newStructure: NodeTreeItem[]) {
    this.structure(newStructure);
    this.buildTree();
  }

  // Get all item paths for easy access
  public getItemPaths(): string[] {
    return Array.from(this.rows.keys());
  }

  // Get all row layouts in order for sequential animation
  public getRowLayouts(): Layout[] {
    return Array.from(this.rows.values()).map(row => row.layout);
  }

  // Sequential fade in animation for all rows
  public *fadeInSequentially(duration: number = 0.3, staggerDelay: number = 0.1) {
    const layouts = this.getRowLayouts();
    
    // Fade in each row sequentially (they start invisible from renderItem)
    for (const layout of layouts) {
      yield* layout.opacity(1, duration);
      if (staggerDelay > 0) {
        yield* waitFor(staggerDelay);
      }
    }
  }

  // Find item by name
  public findItemPath(name: string): string | undefined {
    for (const [path, row] of this.rows) {
      if (row.item.name === name) {
        return path;
      }
    }
    return undefined;
  }
}
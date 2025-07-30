import {
  Layout,
  LayoutProps,
  Rect,
  Txt,
  Icon,
  Node,
} from '@motion-canvas/2d/lib/components';
import { initial, signal } from '@motion-canvas/2d/lib/decorators';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { PossibleColor } from '@motion-canvas/core/lib/types';
import { all } from '@motion-canvas/core';

export interface FileTreeItem {
  name: string;
  type: 'file' | 'folder' | 'asset';
  children?: FileTreeItem[];
  extension?: string;
  expanded?: boolean;
}

export interface FileTreeProps extends LayoutProps {
  structure?: SignalValue<FileTreeItem[]>;
  folderColor?: SignalValue<PossibleColor>;
  fileColor?: SignalValue<PossibleColor>;
  assetColor?: SignalValue<PossibleColor>;
  labelColor?: SignalValue<PossibleColor>;
  indentAmount?: SignalValue<number>;
  rowSize?: SignalValue<number>;
  textSize?: SignalValue<number>;
  iconSize?: SignalValue<number>;
}

interface FileTreeRow {
  item: FileTreeItem;
  layout: Layout;
  icon: Txt;
  label: Txt;
  background: Rect;
  level: number;
}

export class FileTree extends Layout {
  @initial([])
  @signal()
  declare public readonly structure: SimpleSignal<FileTreeItem[]>;

  @initial('#3498db')
  @signal()
  declare public readonly folderColor: SimpleSignal<PossibleColor>;

  @initial('#95a5a6')
  @signal()
  declare public readonly fileColor: SimpleSignal<PossibleColor>;

  @initial('#e74c3c')
  @signal()
  declare public readonly assetColor: SimpleSignal<PossibleColor>;

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

  @initial(16)
  @signal()
  declare public readonly iconSize: SimpleSignal<number>;

  private rows: Map<string, FileTreeRow> = new Map();

  public constructor(props?: FileTreeProps) {
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

  private renderItems(items: FileTreeItem[], level: number) {
    for (const item of items) {
      this.renderItem(item, level);
      
      if (item.children && item.expanded !== false) {
        this.renderItems(item.children, level + 1);
      }
    }
  }

  private renderItem(item: FileTreeItem, level: number) {
    const rowLayout = new Layout({
      layout: true,
      direction: 'row',
      alignItems: 'center',
      width: '100%',
      height: this.rowSize,
      paddingLeft: level * this.indentAmount(),
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

    // Icon
    const icon = new Txt({
      text: this.getIcon(item),
      fontSize: this.iconSize,
      fill: this.getIconColor(item),
      fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
      marginRight: 8,
    });
    rowLayout.add(icon);

    // Label
    const label = new Txt({
      text: item.name,
      fontSize: this.textSize,
      fill: this.labelColor,
      fontFamily: 'Monaco, "SF Mono", Consolas, monospace',
    });
    rowLayout.add(label);

    this.add(rowLayout);

    // Store reference for later manipulation
    const key = `${level}-${item.name}`;
    this.rows.set(key, {
      item,
      layout: rowLayout,
      icon,
      label,
      background,
      level,
    });
  }

  private getIcon(item: FileTreeItem): string {
    switch (item.type) {
      case 'folder':
        return item.expanded !== false ? '📁' : '📂';
      case 'asset':
        return this.getAssetIcon(item.extension);
      case 'file':
      default:
        return this.getFileIcon(item.extension);
    }
  }

  private getFileIcon(extension?: string): string {
    switch (extension?.toLowerCase()) {
      case 'tsx':
      case 'jsx':
        return '⚛️';
      case 'ts':
      case 'js':
        return '📜';
      case 'css':
      case 'scss':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return '🖼️';
      default:
        return '📄';
    }
  }

  private getAssetIcon(extension?: string): string {
    switch (extension?.toLowerCase()) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return '🖼️';
      case 'svg':
        return '🎨';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'mp4':
      case 'mov':
        return '🎬';
      default:
        return '📦';
    }
  }

  private getIconColor(item: FileTreeItem): PossibleColor {
    switch (item.type) {
      case 'folder':
        return this.folderColor();
      case 'asset':
        return this.assetColor();
      case 'file':
      default:
        return this.fileColor();
    }
  }

  // Animation methods
  public *emphasize(itemPath: string, duration: number = 0.3) {
    const row = this.rows.get(itemPath);
    if (!row) return;

    yield* all(
      row.background.opacity(0.2, duration),
      row.background.fill('#3498db', duration),
      row.icon.scale(1.2, duration),
      row.label.fill('#ffffff', duration),
    );
  }

  public *reset(itemPath: string, duration: number = 0.3) {
    const row = this.rows.get(itemPath);
    if (!row) return;

    yield* all(
      row.background.opacity(0, duration),
      row.background.fill('#ffffff', duration),
      row.icon.scale(1, duration),
      row.label.fill(this.labelColor(), duration),
    );
  }

  public *resetAll(duration: number = 0.3) {
    const animations = Array.from(this.rows.keys()).map(key => 
      this.reset(key, duration)
    );
    yield* all(...animations);
  }

  // Update the tree structure
  public updateStructure(newStructure: FileTreeItem[]) {
    this.structure(newStructure);
    this.buildTree();
  }

  // Get all item paths for easy access
  public getItemPaths(): string[] {
    return Array.from(this.rows.keys());
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
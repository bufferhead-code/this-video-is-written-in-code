import {signal, Signal} from '@preact/signals';

export class SignalSet<T> {
  private set = new Set<T>();
  private changed = signal(0);

  public has(value: T): boolean {
    this.changed.value; // Subscribe to changes
    return this.set.has(value);
  }

  public add(value: T): void {
    if (!this.set.has(value)) {
      this.set.add(value);
      this.changed.value++;
    }
  }

  public delete(value: T): void {
    if (this.set.has(value)) {
      this.set.delete(value);
      this.changed.value++;
    }
  }

  public clear(): void {
    if (this.set.size > 0) {
      this.set.clear();
      this.changed.value++;
    }
  }

  public toggle(value: T): void {
    if (this.set.has(value)) {
      this.delete(value);
    } else {
      this.add(value);
    }
  }

  public get size(): number {
    this.changed.value; // Subscribe to changes
    return this.set.size;
  }

  public values(): IterableIterator<T> {
    this.changed.value; // Subscribe to changes
    return this.set.values();
  }
} 
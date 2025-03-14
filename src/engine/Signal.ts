/* eslint-disable @typescript-eslint/no-explicit-any */
type Callback = (...args: any[]) => void;

export class Signal {
  private listeners: Callback[] = [];

  public addListener(callback: Callback): void {
    this.listeners.push(callback);
  }

  public removeListener(callback: Callback): void {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public dispatch(...args: any[]): void {
    for (const listener of this.listeners) {
      listener(...args);
    }
  }
}
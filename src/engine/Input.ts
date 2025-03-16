export enum Key {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  ENTER = 'Enter',
  ESCAPE = 'Escape'
}

export class Input {
  private keysPressed: { [key in Key]?: boolean } = {};
  private keysJustPressed: { [key in Key]?: boolean } = {};
  private keysReleased: { [key in Key]?: boolean } = {};

  public static instance: Input;

  constructor() {
    Input.instance = this;

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  public static getInstance(): Input {
    if (!Input.instance) {
      Input.instance = new Input();
    }
    return Input.instance;
  }

  private onKeyDown(event: KeyboardEvent): void {
    const key = event.key as Key;
    if (!this.keysPressed[key]) {
      this.keysJustPressed[key] = true;
    }

    this.keysPressed[key] = true;
  }

  private onKeyUp(event: KeyboardEvent): void {
    const key = event.key as Key;
    this.keysPressed[key] = false;
    this.keysReleased[key] = true;
  }

  public isJustPressed(key: Key): boolean {
    const isJustPressed = !!this.keysJustPressed[key];
    this.keysJustPressed[key] = false;
    return isJustPressed;
  }

  public isPressed(key: Key): boolean {
    return !!this.keysPressed[key];
  }

  public isReleased(key: Key): boolean {
    const isReleased = !!this.keysReleased[key];
    this.keysReleased[key] = false;
    return isReleased;
  }
}
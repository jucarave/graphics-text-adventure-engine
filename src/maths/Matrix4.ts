import { Signal } from '../engine/Signal';

export class Matrix4 {
  private data: Float32Array;
  public onChange: Signal = new Signal();

  constructor() {
    this.data = new Float32Array(16);
    this.setIdentity();
  }

  public setIdentity(): this {
    this.data.set([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    this.onChange.dispatch(this);

    return this;
  }

  public multiply(matrix: Matrix4): this {
    const a = this.data;
    const b = matrix.data;
    const result = new Float32Array(16);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result[row * 4 + col] =
          a[row * 4 + 0] * b[0 * 4 + col] +
          a[row * 4 + 1] * b[1 * 4 + col] +
          a[row * 4 + 2] * b[2 * 4 + col] +
          a[row * 4 + 3] * b[3 * 4 + col];
      }
    }

    this.data.set(result);
    this.onChange.dispatch(this);

    return this;
  }

  public rotateX(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set([
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    ]);

    return this.multiply(rotation);
  }

  public rotateY(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set([
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    ]);

    return this.multiply(rotation);
  }

  public rotateZ(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set([
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

    return this.multiply(rotation);
  }

  public translate(x: number, y: number, z: number): this {
    const translation = new Matrix4().set([
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1
    ]);
    return this.multiply(translation);
  }

  public set(data: number[]): this {
    if (data.length !== 16) {
      throw new Error('Matrix4 data must have 16 elements.');
    }

    this.data.set(data);
    this.onChange.dispatch(this);
    return this;
  }

  public getData(): Float32Array {
    return this.data;
  }

  public static identity(): Matrix4 {
    return new Matrix4().setIdentity();
  }

}
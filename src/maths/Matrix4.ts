import { Signal } from '../engine/Signal';

export class Matrix4 {
  private data: Array<number>;
  public onChange: Signal = new Signal();

  constructor() {
    this.data = [];
    this.setIdentity();
  }

  public set(...args: Array<number>): this {
    if (args.length !== 16) {
      throw new Error('Matrix4 must have 16 elements.');
    }

    for (let i=0; i<16; i++) {
      this.data[i] = args[i];
    }

    this.onChange.dispatch(this);
    return this;
  }

  public setIdentity(): this {
    this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    return this;
  }

  public copy(matrix: Matrix4): this {
    this.set(...matrix.data);
    return this;
  }

  private vector4Dot(A: Array<number>, B: Array<number>): number {
    return A[0] * B[0] + A[1] * B[1] + A[2] * B[2] + A[3] * B[3];
  }

  public multiply(matrixB: Matrix4): this {
    let T: Array<number> = matrixB.data;

    const C1 = [T[0], T[4], T[8], T[12]];
    const C2 = [T[1], T[5], T[9], T[13]];
    const C3 = [T[2], T[6], T[10], T[14]];
    const C4 = [T[3], T[7], T[11], T[15]];

    T = this.data;
    const R1 = [T[0], T[1], T[2], T[3]];
    const R2 = [T[4], T[5], T[6], T[7]];
    const R3 = [T[8], T[9], T[10], T[11]];
    const R4 = [T[12], T[13], T[14], T[15]];

    this.set(
      this.vector4Dot(R1, C1),
      this.vector4Dot(R1, C2),
      this.vector4Dot(R1, C3),
      this.vector4Dot(R1, C4),

      this.vector4Dot(R2, C1),
      this.vector4Dot(R2, C2),
      this.vector4Dot(R2, C3),
      this.vector4Dot(R2, C4),

      this.vector4Dot(R3, C1),
      this.vector4Dot(R3, C2),
      this.vector4Dot(R3, C3),
      this.vector4Dot(R3, C4),

      this.vector4Dot(R4, C1),
      this.vector4Dot(R4, C2),
      this.vector4Dot(R4, C3),
      this.vector4Dot(R4, C4)
    );

    this.onChange.dispatch(this);
    return this;
  }

  public rotateX(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set(
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );

    return this.multiply(rotation);
  }

  public rotateY(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    );

    return this.multiply(rotation);
  }

  public rotateZ(angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotation = new Matrix4().set(
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    return this.multiply(rotation);
  }

  public translate(x: number, y: number, z: number, relative: boolean = false): this {
    if (relative) {
      this.data[12] += x;
      this.data[13] += y;
      this.data[14] += z;
    } else {
      this.data[12] = x;
      this.data[13] = y;
      this.data[14] = z;
    }

    this.onChange.dispatch(this);
    return this;
  }

  public getData(): Array<number> {
    return this.data;
  }

  public static identity(): Matrix4 {
    return new Matrix4().setIdentity();
  }
}
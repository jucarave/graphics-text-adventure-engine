import { Signal } from '../engine/Signal';

export class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;
  public onChange: Signal = new Signal();

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    if (this._x !== value) {
      this._x = value;
      this.onChange.dispatch(this);
    }
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    if (this._y !== value) {
      this._y = value;
      this.onChange.dispatch(this);
    }
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    if (this._z !== value) {
      this._z = value;
      this.onChange.dispatch(this);
    }
  }

  public set(x: number, y: number, z: number): this {
    this._x = x;
    this._y = y;
    this._z = z;
    this.onChange.dispatch(this);
    return this;
  }

  public add(vector: Vector3): this {
    this._x += vector.x;
    this._y += vector.y;
    this._z += vector.z;
    this.onChange.dispatch(this);
    return this;
  }

  public clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z);
  }

  public dot(vector: Vector3): number {
    return this._x * vector.x + this._y * vector.y + this._z * vector.z;
  }

  public cross(vector: Vector3): Vector3 {
    const x = this._y * vector.z - this._z * vector.y;
    const y = this._z * vector.x - this._x * vector.z;
    const z = this._x * vector.y - this._y * vector.x;
    return new Vector3(x, y, z);
  }
}
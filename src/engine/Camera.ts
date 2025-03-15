import { Vector3 } from '../maths/Vector3';
import { Matrix4 } from '../maths/Matrix4';

export class Camera {
  public position: Vector3;
  public modelMatrix: Matrix4;
  public projectionMatrix: Matrix4;

  public static instance: Camera;

  private isDirty: boolean;

  constructor(width: number, height: number) {
    Camera.instance = this;

    this.position = new Vector3();
    this.modelMatrix = new Matrix4();
    this.projectionMatrix = this.createOrthographicProjection(width, height, 0.1, 1000);
    this.isDirty = true;

    this.position.onChange.addListener(() => {
      this.isDirty = true;
    });
  }

  private createOrthographicProjection(width: number, height: number, znear: number, zfar: number): Matrix4 {
    const left = -width / 2;
    const right = width / 2;
    const bottom = -height / 2;
    const top = height / 2;

    const A = 2 / (right - left);
    const B = 2 / (top - bottom);
    const C = -2 / (zfar - znear);

    const X = -(right + left) / (right - left);
    const Y = -(top + bottom) / (top - bottom);
    const Z = -(zfar + znear) / (zfar - znear);

    const projection = new Matrix4().set(
      A, 0, 0, 0,
      0, B, 0, 0,
      0, 0, C, 0,
      X, Y, Z, 1
    );

    return projection;
  }

  public getModelMatrix(): Matrix4 {
    if (this.isDirty) {
      this.modelMatrix.setIdentity().translate(this.position.x, this.position.y, this.position.z);
      this.isDirty = false;
    }

    return this.modelMatrix;
  }
}
import { Shader } from './Shader';
import { Texture } from './Texture';
import { Geometry } from './Geometry';
import { Camera } from './Camera';
import { Matrix4 } from '../maths/Matrix4';

export class Material {
  private gl: WebGLRenderingContext;
  private shader: Shader;
  private texture: Texture;
  private finalModelMatrix: Matrix4 = new Matrix4();
  private static currentMaterial: Material | null = null;
  public color: [number, number, number, number];

  private positionLocation: number;
  private texCoordLocation: number;
  private uModelMatrixLocation: WebGLUniformLocation;
  private uProjectionMatrixLocation: WebGLUniformLocation;
  private uColorLocation: WebGLUniformLocation;

  private static materials: { [name: string]: Material } = {};

  constructor(gl: WebGLRenderingContext, shader: Shader, texture: Texture, name: string) {
    this.gl = gl;
    this.shader = shader;
    this.texture = texture;
    this.color = [1, 1, 1, 1];

    this.positionLocation = this.shader.getAttributeLocation('aPosition');
    this.texCoordLocation = this.shader.getAttributeLocation('aTexCoord');
    this.uModelMatrixLocation = this.shader.getUniformLocation('uModelMatrix');
    this.uProjectionMatrixLocation = this.shader.getUniformLocation('uProjectionMatrix');
    this.uColorLocation = this.shader.getUniformLocation('uColor');

    if (Material.materials[name]) {
      throw new Error(`Material already exists: ${name}`);
    }

    Material.materials[name] = this;
  }

  public static getMaterial(name: string): Material | undefined {
    return Material.materials[name];
  }

  public render(geometry: Geometry, modelMatrix: Matrix4): void {
    const gl = this.gl;

    if (Material.currentMaterial !== this) {
      this.shader.use();

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.getWebGLTexture());

      Material.currentMaterial = this;
    }

    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.texCoordLocation);

    geometry.bind();
    gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

    const camera = Camera.instance;
    this.finalModelMatrix.copy(modelMatrix).multiply(camera.getModelMatrix());

    gl.uniformMatrix4fv(this.uModelMatrixLocation, false, this.finalModelMatrix.getData());
    gl.uniformMatrix4fv(this.uProjectionMatrixLocation, false, camera.projectionMatrix.getData());
    gl.uniform4fv(this.uColorLocation, this.color);

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);

    geometry.unbind();
  }
}
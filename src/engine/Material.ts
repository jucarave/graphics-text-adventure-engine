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

  constructor(gl: WebGLRenderingContext, shader: Shader, texture: Texture) {
    this.gl = gl;
    this.shader = shader;
    this.texture = texture;
  }

  public render(geometry: Geometry, modelMatrix: Matrix4): void {
    const gl = this.gl;

    if (Material.currentMaterial !== this) {
      this.shader.use();

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.getWebGLTexture());

      Material.currentMaterial = this;
    }

    const positionLocation = this.shader.getAttributeLocation('aPosition');
    const texCoordLocation = this.shader.getAttributeLocation('aTexCoord');

    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    geometry.bind();
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

    const camera = Camera.instance;
    this.finalModelMatrix.copy(modelMatrix).multiply(camera.getModelMatrix());

    const uModelMatrixLocation = this.shader.getUniformLocation('uModelMatrix');
    const uProjectionMatrixLocation = this.shader.getUniformLocation('uProjectionMatrix');

    gl.uniformMatrix4fv(uModelMatrixLocation, false, this.finalModelMatrix.getData());
    gl.uniformMatrix4fv(uProjectionMatrixLocation, false, camera.projectionMatrix.getData());

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);

    geometry.unbind();
  }
}
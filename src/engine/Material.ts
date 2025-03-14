import { Shader } from './Shader';
import { Texture } from './Texture';
import { Geometry } from './Geometry';
import { Camera } from './Camera';
import { Matrix4 } from '../maths/Matrix4';

export class Material {
  private gl: WebGLRenderingContext;
  private shader: Shader;
  private texture: Texture;
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

      const positionLocation = this.shader.getAttributeLocation('aPosition');
      const texCoordLocation = this.shader.getAttributeLocation('aTexCoord');

      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(texCoordLocation);

      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

      Material.currentMaterial = this;
    }

    geometry.bind();

    const camera = Camera.instance;
    const finalModelMatrix = camera.getModelMatrix().multiply(modelMatrix);

    const uModelMatrixLocation = this.shader.getUniformLocation('uModelMatrix');
    const uProjectionMatrixLocation = this.shader.getUniformLocation('uProjectionMatrix');

    gl.uniformMatrix4fv(uModelMatrixLocation, false, finalModelMatrix.getData());
    gl.uniformMatrix4fv(uProjectionMatrixLocation, false, camera.projectionMatrix.getData());

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);

    geometry.unbind();
  }
}
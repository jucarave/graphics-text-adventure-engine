export class Geometry {
  private gl: WebGLRenderingContext;
  private vertices: number[] = [];
  private indices: number[] = [];
  private indicesCount: number = 0;
  private textureCoords: number[] = [];
  private vbo: WebGLBuffer | null = null;
  private ebo: WebGLBuffer | null = null;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  public addVertex(x: number, y: number, z: number, tx: number, ty: number): Geometry {
    this.vertices.push(x, y, z);
    this.textureCoords.push(tx, ty);
    return this;
  }

  public addIndex(index: number): Geometry {
    this.indices.push(index);
    return this;
  }

  public build(): void {
    const gl = this.gl;

    this.vbo = gl.createBuffer();
    if (!this.vbo) {
      throw new Error('Unable to create VBO.');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

    const vertexData = [];
    for (let i = 0; i < this.vertices.length / 3; i++) {
      vertexData.push(
        this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2],
        this.textureCoords[i * 2], this.textureCoords[i * 2 + 1]
      );
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    this.ebo = gl.createBuffer();
    if (!this.ebo) {
      throw new Error('Unable to create EBO.');
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.indicesCount = this.indices.length;

    this.vertices = [];
    this.indices = [];
    this.textureCoords = [];

    this.unbind();
  }

  public bind(): void {
    const gl = this.gl;

    if (this.vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }

    if (this.ebo) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    }
  }

  public unbind(): void {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  public getIndicesCount(): number {
    return this.indicesCount;
  }
}
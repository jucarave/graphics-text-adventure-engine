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

  public static createQuad(gl: WebGLRenderingContext, width: number, height: number, uvs: [number, number, number, number], anchorX: number, anchorY: number): Geometry {
    const geometry = new Geometry(gl);

    const x0 = -anchorX * width;
    const x1 = (1 - anchorX) * width;
    const y0 = -anchorY * height;
    const y1 = (1 - anchorY) * height;

    const [u0, v0, u1, v1] = uvs;

    geometry.addVertex(x0, y0, 0, u0, v1)
      .addVertex(x1, y0, 0, u1, v1)
      .addVertex(x1, y1, 0, u1, v0)
      .addVertex(x0, y1, 0, u0, v0)
      .addIndex(0).addIndex(1).addIndex(2)
      .addIndex(2).addIndex(3).addIndex(0);

    geometry.build();

    return geometry;
  }
}
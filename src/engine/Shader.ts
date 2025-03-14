export class Shader {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private attributes: { [name: string]: number } = {};
  private uniforms: { [name: string]: WebGLUniformLocation } = {};

  constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this.gl = gl;
    const vertexShader = this.compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentSource, gl.FRAGMENT_SHADER);
    this.program = this.createProgram(vertexShader, fragmentShader);
    this.extractAttributesAndUniforms();
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Unable to create shader.');
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Could not compile shader:\n${info}`);
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Unable to create program.');
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Could not link program:\n${info}`);
    }

    return program;
  }

  private extractAttributesAndUniforms(): void {
    const gl = this.gl;
    const program = this.program;

    const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attributeCount; i++) {
      const info = gl.getActiveAttrib(program, i);
      if (info) {
        this.attributes[info.name] = gl.getAttribLocation(program, info.name);
      }
    }

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) {
        const location = gl.getUniformLocation(program, info.name);
        if (location) {
          this.uniforms[info.name] = location;
        }
      }
    }
  }

  public use(): void {
    const currentProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
    if (currentProgram !== this.program) {
      this.gl.useProgram(this.program);

      for (const name in this.attributes) {
        const location = this.attributes[name];
        this.gl.enableVertexAttribArray(location);
      }
    }
  }

  public getAttributeLocation(name: string): number {
    if (!(name in this.attributes)) {
      throw new Error(`Attribute not found: ${name}`);
    }

    return this.attributes[name];
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    if (!(name in this.uniforms)) {
      throw new Error(`Uniform not found: ${name}`);
    }

    return this.uniforms[name];
  }
}
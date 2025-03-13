export class Renderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;

  public static instance: Renderer;

  constructor(canvas: HTMLCanvasElement) {
    Renderer.instance = this;

    this.canvas = canvas;
    this.gl = this.initWebGLContext(canvas);
    this.initGLSettings();
  }

  private initWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('Unable to initialize WebGL.');
    }

    return gl;
  }

  private initGLSettings(): void {
    const gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public clear(): void {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public get GL(): WebGLRenderingContext {
    return this.gl;
  }
}
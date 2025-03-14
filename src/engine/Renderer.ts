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

  public onResize(): void {
    const canvas = this.canvas;
    const aspectRatio = 427 / 240;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    canvas.width = width;
    canvas.height = height;

    this.gl.viewport(0, 0, width, height);
  }

  public clear(): void {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public get GL(): WebGLRenderingContext {
    return this.gl;
  }
}
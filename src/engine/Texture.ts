export class Texture {
  private static textures: { [name: string]: Texture } = {};

  private texture: WebGLTexture;
  private isReady: boolean = false;
  private image: HTMLImageElement | null = null;

  constructor(gl: WebGLRenderingContext, name: string, url: string) {
    if (Texture.textures[name]) {
      throw new Error(`Texture already exists: ${name}`);
    }

    this.texture = this.loadTexture(gl, url);
    Texture.textures[name] = this;
  }

  private loadTexture(gl: WebGLRenderingContext, url: string): WebGLTexture {
    const texture = gl.createTexture();
    if (!texture) {
      throw new Error('Unable to create texture.');
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = (): void => {
      this.isReady = true;
      this.image = image;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };
    image.src = url;

    return texture;
  }

  public static getTexture(name: string): Texture {
    if (!(name in Texture.textures)) {
      throw new Error(`Texture not found: ${name}`);
    }
    return Texture.textures[name];
  }

  public static areTexturesLoaded(): boolean {
    for (const name in Texture.textures) {
      if (!Texture.textures[name].isReady) {
        return false;
      }
    }

    return true;
  }

  public getWebGLTexture(): WebGLTexture {
    return this.texture;
  }

  public get width(): number {
    if (!this.image) {
      return 0;
    }

    return this.image.width;
  }

  public get height(): number {
    if (!this.image) {
      return 0;
    }

    return this.image.height;
  }
}
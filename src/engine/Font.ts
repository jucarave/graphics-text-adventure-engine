import { Texture } from './Texture';

interface Glyph {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Font {
  private gl: WebGLRenderingContext;
  private texture: Texture;
  private charMap: { [char: string]: Glyph } = {};
  private characters: string;
  private columns: number;
  private baseGlyphWidth: number;
  private baseGlyphHeight: number;

  constructor(gl: WebGLRenderingContext, texture: Texture, characters: string, columns: number, baseGlyphWidth: number, baseGlyphHeight: number) {
    this.gl = gl;
    this.texture = texture;
    this.characters = characters;
    this.columns = columns;
    this.baseGlyphWidth = baseGlyphWidth;
    this.baseGlyphHeight = baseGlyphHeight;

    this.parseFont();
  }

  private parseFont(): void {
    const image = this.texture.getImage();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get 2D context');
    }

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < this.characters.length; i++) {
      const char = this.characters[i];
      const x = (i % this.columns) * this.baseGlyphWidth;
      const y = Math.floor(i / this.columns) * this.baseGlyphHeight;

      let glyphWidth = this.baseGlyphWidth;
      for (let col = this.baseGlyphWidth - 1; col >= 0; col--) {
        let isEmpty = true;
        for (let row = 0; row < this.baseGlyphHeight; row++) {
          const pixelIndex = ((y + row) * canvas.width + (x + col)) * 4;
          const alpha = imageData[pixelIndex + 3];
          if (alpha > 0) {
            isEmpty = false;
            break;
          }
        }
        if (!isEmpty) {
          glyphWidth = col + 1;
          break;
        }
      }

      this.charMap[char] = { x, y, width: glyphWidth, height: this.baseGlyphHeight };
    }
  }

  public getGlyph(char: string): Glyph | undefined {
    return this.charMap[char];
  }

  public getTexture(): WebGLTexture {
    return this.texture.getWebGLTexture();
  }

  public getImage(): HTMLImageElement {
    return this.texture.getImage();
  }
}
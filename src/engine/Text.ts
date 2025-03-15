import { Font } from './Font';
import { Geometry } from './Geometry';

export class Text {
  private gl: WebGLRenderingContext;
  private font: Font;
  private text: string;
  private geometry: Geometry;
  private spacing: number;

  constructor(gl: WebGLRenderingContext, font: Font, text: string, spacing: number = 1) {
    this.gl = gl;
    this.font = font;
    this.text = text;
    this.spacing = spacing;
    this.geometry = new Geometry(gl);
    this.createGeometry();
  }

  private createGeometry(): void {
    const uvOffset = 0.1;
    let xOffset = 0;
    let vertexOffset = 0;

    for (const char of this.text) {
      const glyph = this.font.getGlyph(char);
      if (!glyph) {
        continue;
      }

      const x = xOffset;
      const y = 0;
      const width = glyph.width;
      const height = glyph.height;

      const imageWidth = this.font.getImage().width;
      const imageHeight = this.font.getImage().height;

      const u1 = (glyph.x + uvOffset) / imageWidth;
      const v1 = (glyph.y + uvOffset) / imageHeight;
      const u2 = (glyph.x + width - uvOffset) / imageWidth;
      const v2 = (glyph.y + height - uvOffset) / imageHeight;

      this.geometry.addVertex(x, y, 0, u1, v2)
        .addVertex(x + width, y, 0, u2, v2)
        .addVertex(x + width, y + height, 0, u2, v1)
        .addVertex(x, y + height, 0, u1, v1)
        .addIndex(vertexOffset).addIndex(vertexOffset + 1).addIndex(vertexOffset + 2)
        .addIndex(vertexOffset + 2).addIndex(vertexOffset + 3).addIndex(vertexOffset);

      xOffset += width + this.spacing;
      vertexOffset += 4;
    }

    this.geometry.build();
  }

  public getGeometry(): Geometry {
    return this.geometry;
  }
}
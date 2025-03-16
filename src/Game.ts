import { Camera } from './engine/Camera';
import { gameData } from './engine/GameData';
import { Material } from './engine/Material';
import { Renderer } from './engine/Renderer';
import { Shader } from './engine/Shader';
import { Texture } from './engine/Texture';
import { Geometry } from './engine/Geometry';
import { Entity } from './engine/Entity';
import { Font } from './engine/Font';
import { Text } from './engine/Text';
import { basicShader } from './shaders/BasicShader';

class Game {
  private renderer: Renderer;
  private camera: Camera;
  private entity: Entity | null = null;
  private textEntity: Entity | null = null;

  constructor() {
    this.renderer = new Renderer(document.getElementById('canvas') as HTMLCanvasElement);
    this.camera = new Camera(427, 240);

    new Texture(this.renderer.GL, 'redSquare', 'img/redSquare.png');
    new Texture(this.renderer.GL, 'font', 'img/font.png');

    this.waitForTexturesToLoad();
  }

  private waitForTexturesToLoad(): void {
    if (!Texture.areTexturesLoaded()) {
      requestAnimationFrame(() => this.waitForTexturesToLoad());
    } else {
      this.init();
    }
  }

  private init(): void {
    gameData.shader = new Shader(this.renderer.GL, basicShader.vertexShader, basicShader.fragmentShader);
    const material = new Material(this.renderer.GL, gameData.shader, Texture.getTexture('redSquare'), 'Basic');

    const quad = new Geometry(this.renderer.GL);
    quad.addVertex(-16, -16, 0, 0, 0)
      .addVertex(16, -16, 0, 1, 0)
      .addVertex(16, 16, 0, 1, 1)
      .addVertex(-16, 16, 0, 0, 1)
      .addIndex(0).addIndex(1).addIndex(2)
      .addIndex(2).addIndex(3).addIndex(0)
      .build();

    this.entity = new Entity(quad, material);
    this.entity.position.y = 0;

    const font = new Font(this.renderer.GL, Texture.getTexture('font'), 'abcdefghijklmnñopqrstuvwxyzáéíóúüABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ0123456789!¡?¿()-=/., ', 42, 6, 11);
    const textGeometry = new Text(this.renderer.GL, font, 'Hello, World!').getGeometry();
    const textMaterial = new Material(this.renderer.GL, gameData.shader, Texture.getTexture('font'), 'Green text');
    textMaterial.color = [0, 1, 0, 1];

    this.textEntity = new Entity(textGeometry, textMaterial);
    this.textEntity.position.y = 24;

    this.camera.position.z = -100;

    gameData.shader.use();

    window.addEventListener('resize', this.renderer.onResize.bind(this.renderer));
    this.renderer.onResize();

    this.gameLoop();
  }

  private gameLoop(): void {
    this.renderer.clear();
    if (this.entity) this.entity.render();
    if (this.textEntity) {
      this.textEntity.render();
      this.textEntity.setRotation(this.textEntity.rotation + 0.01);
    }

    requestAnimationFrame(() => this.gameLoop());
  }
}

window.onload = (): void => {
  new Game();
};
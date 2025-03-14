import { Camera } from './engine/Camera';
import { gameData } from './engine/GameData';
import { Material } from './engine/Material';
import { Renderer } from './engine/Renderer';
import { Shader } from './engine/Shader';
import { Texture } from './engine/Texture';
import { Geometry } from './engine/Geometry';
import { Entity } from './engine/Entity';
import { basicShader } from './shaders/BasicShader';

class Game {
  private renderer: Renderer;
  private camera: Camera;
  private entity: Entity;

  constructor() {
    this.renderer = new Renderer(document.getElementById('canvas') as HTMLCanvasElement);
    this.camera = new Camera(427, 240);
    new Texture(this.renderer.GL, 'redSquare', 'img/redSquare.png');

    gameData.shader = new Shader(this.renderer.GL, basicShader.vertexShader, basicShader.fragmentShader);
    gameData.material = new Material(this.renderer.GL, gameData.shader, Texture.getTexture('redSquare'));

    const quad = new Geometry(this.renderer.GL);
    quad.addVertex(-16, -16, 0, 0, 0)
      .addVertex(16, -16, 0, 1, 0)
      .addVertex(16, 16, 0, 1, 1)
      .addVertex(-16, 16, 0, 0, 1)
      .addIndex(0).addIndex(1).addIndex(2)
      .addIndex(2).addIndex(3).addIndex(0)
      .build();

    this.entity = new Entity(quad, gameData.material);

    this.camera.position.z = 100;

    gameData.shader.use();

    window.addEventListener('resize', this.renderer.onResize.bind(this.renderer));
    this.renderer.onResize();

    this.gameLoop();
  }

  private gameLoop(): void {
    this.renderer.clear();
    this.entity.render();

    requestAnimationFrame(() => this.gameLoop());
  }
}

window.onload = (): void => {
  new Game();
};
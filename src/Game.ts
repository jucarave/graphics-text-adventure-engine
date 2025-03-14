import { Camera } from './engine/Camera';
import { gameData } from './engine/GameData';
import { Material } from './engine/Material';
import { Renderer } from './engine/Renderer';
import { Shader } from './engine/Shader';
import { Texture } from './engine/Texture';
import { Geometry } from './engine/Geometry';
import { Entity } from './engine/Entity';
import { basicShader } from './shaders/BasicShader';

let entity: Entity;
class Game {
  constructor() {
    const renderer = new Renderer(document.getElementById('canvas') as HTMLCanvasElement);
    const camera = new Camera(320, 240);
    new Texture(renderer.GL, 'redSquare', 'img/redSquare.png');

    gameData.shader = new Shader(renderer.GL, basicShader.vertexShader, basicShader.fragmentShader);
    gameData.material = new Material(renderer.GL, gameData.shader, Texture.getTexture('redSquare'));

    const quad = new Geometry(renderer.GL);
    quad.addVertex(-16, -16, 0, 0, 0)
      .addVertex(16, -16, 0, 1, 0)
      .addVertex(16, 16, 0, 1, 1)
      .addVertex(-16, 16, 0, 0, 1)
      .addIndex(0).addIndex(1).addIndex(2)
      .addIndex(2).addIndex(3).addIndex(0)
      .build();

    entity = new Entity(quad, gameData.material);

    camera.position.z = 100;

    gameData.shader.use();

    this.gameLoop();
  }

  private gameLoop(): void {
    Renderer.instance.clear();
    entity.render();

    requestAnimationFrame(() => this.gameLoop());
  }
}

window.onload = (): void => {
  new Game();
};
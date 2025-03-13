import { gameData } from './engine/GameData';
import { Renderer } from './engine/Renderer';
import { Shader } from './engine/Shader';
import { basicShader } from './shaders/BasicShader';

class Game {
  constructor() {
    const renderer = new Renderer(document.getElementById('canvas') as HTMLCanvasElement);
    gameData.shader = new Shader(renderer.GL, basicShader.vertexShader, basicShader.fragmentShader);

    gameData.shader.use();
    renderer.clear();
  }
}

window.onload = (): void => {
  new Game();
};
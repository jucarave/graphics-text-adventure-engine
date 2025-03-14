import { Material } from './Material';
import { Shader } from './Shader';

interface GameData {
  shader: Shader | null;
  material: Material | null;
}

export const gameData: GameData = {
  shader: null,
  material: null
};
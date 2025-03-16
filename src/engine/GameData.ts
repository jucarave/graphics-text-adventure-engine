import { Shader } from './Shader';

interface GameData {
  shader: Shader | null;
}

export const gameData: GameData = {
  shader: null,
};
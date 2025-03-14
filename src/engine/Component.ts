export abstract class Component {
  public init(): void {};

  // eslint-disable-next-line no-unused-vars
  public update(deltaTime: number): void {};

  public destroy(): void {};
}
import { Entity } from './Entity';

export class Scene {
  private entities: Entity[] = [];
  private initialized: boolean = false;

  public addEntity(entity: Entity): void {
    this.entities.push(entity);

    if (this.initialized) {
      entity.init();
    }
  }

  public removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);

    if (index !== -1) {
      this.entities.splice(index, 1);
      entity.destroy();
    }
  }

  public init(): void {
    this.initialized = true;

    for (const entity of this.entities) {
      entity.init();
    }
  }

  public update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  public destroy(): void {
    for (const entity of this.entities) {
      entity.destroy();
    }

    this.entities = [];
  }

  public render(): void {
    for (const entity of this.entities) {
      entity.render();
    }
  }

  public removeMarkedEntities(): void {
    this.entities = this.entities.filter(entity => !entity.markedForDestruction);
  }
}